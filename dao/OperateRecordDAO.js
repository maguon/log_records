/**
 * Created by lingxue on 2017/4/14.
 */
'use strict'

const operateRecord = require('./schema/RecordsSchema.js').operateRecord ;
const q = require('mongoose').query;
const sysConfig = require('../config/SystemConfig.js');
const mongoose = require('../db/connection/MongoCon.js').getMongo();
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OperateRecordDAO.js');
const recordModel = mongoose.model('op_record', operateRecord);



const getOperateRecord = (params,callback)=>{

    let query = recordModel.find({}).select('_id vin id userId username userType comment op created_on');
    if(params.recordId){
        query.where('_id').equals(params.recordId);
    }
    if(params.carId){
        query.where('id').equals(params.carId);
    }
    if(params.op){
        query.where('op').equals(params.op);
    }
    if(params.userId){
        query.where('userId').equals(params.userId);
    }
    if(params.userType){
        query.where('userType').equals(params.userType);
    }
    if(params.vin){
        var regString = new RegExp(params.vin);
        query.or([{vin:regString}])
    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.sort('-created_on').exec((err,rows)=>{
        logger.debug(' getOperateRecords ') ;
        callback(err,rows);
    })
}
const saveOperateRecord =(params,callback)=>{

    var operateObj = new recordModel({
        id : params.carId,
        vin : params.vin ,
        userId : params.userId,
        username : params.username,
        userType : params.userType,
        comment : params.comment,
        op : params.op
    })
    operateObj.save(function(error,result){
        logger.debug('saveOperateRecord') ;
        callback(error,result);
    })
}
module.exports = {getOperateRecord,saveOperateRecord};