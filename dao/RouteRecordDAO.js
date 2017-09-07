'use strict'
const routeRecord = require('./schema/RecordsSchema.js').routeRecord ;
const q = require('mongoose').query;
const sysConfig = require('../config/SystemConfig.js');
const mongoose = require('../db/connection/MongoCon.js').getMongo();
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('RouteRecordDAO.js');
const recordModel = mongoose.model('route_record', routeRecord);


const getRouteRecord = (params,callback)=>{

    let query = recordModel.find({}).select('_id id comment status created_on');
    if(params.recordId){
        query.where('_id').equals(params.recordId);
    }
    if(params.routeId){
        query.where('id').equals(params.routeId);
    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.sort('-created_on').exec((err,rows)=>{
        logger.debug(' getRouteRecord ') ;
        callback(err,rows);
    })
}
const saveRouteRecord =(params,callback)=>{

    const query = {id:params.routeId};
    const update = { $push: { comment: {id:params.userId,name:params.username,type:params.userType,op:params.op,content:params.content,timez: Date.now()} }}
    recordModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        logger.debug(' saveRouteRecord ') ;
        callback(error,result);
    })
}
module.exports = {getRouteRecord,saveRouteRecord};