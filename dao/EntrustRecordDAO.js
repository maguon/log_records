'use strict'

const entrustRecord = require('./schema/RecordsSchema.js').entrustRecord ;
const q = require('mongoose').query;
const sysConfig = require('../config/SystemConfig.js');
const mongoose = require('../db/connection/MongoCon.js').getMongo();
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OperateRecordDAO.js');
const recordModel = mongoose.model('entrust_record', entrustRecord);

const getEntrustRecord = (params,callback)=>{

    let query = recordModel.find({}).select('_id entrust_id city_route_id  comment  created_on');
    if(params.recordId){
        query.where('_id').equals(params.recordId);
    }
    if(params.entrustId){
        query.where('entrust_id').equals(params.entrustId);
    }
    if(params.cityRouteId){
        query.where('city_route_id').equals(params.cityRouteId);
    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.sort('-created_on').exec((err,rows)=>{
        logger.debug(' getEntrustRecord ') ;
        callback(err,rows);
    })
};

const saveEntrustRecord =(params,callback)=>{

    const query = {entrust_id:params.entrustId ,city_route_id:params.cityRouteId};
    const update = { $push: { comment: {id:params.userId,name:params.username,type:params.userType,content:params.content,timez: Date.now()} }}
    recordModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        logger.debug(' saveEntrustRecord ') ;
        callback(error,result);
    })
}

module.exports = {
    getEntrustRecord ,saveEntrustRecord
}