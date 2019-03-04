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

    let query = recordModel.find({}).select('_id vin id userId username userType make_id make_name comment op created_on');
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
    if(params.makeId){
        query.where('make_id').equals(params.makeId);
    }
    if(params.userType){
        query.where('userType').equals(params.userType);
    }
    if(params.startDate){
        query.where('created_on').gte(params.startDate +" 00:00:00");
    }
    if(params.endDate){
        query.where('created_on').lte(params.endDate + " 23:59:59");
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

const getOpRecordStat = (params,callback) =>{

    let aggregate = recordModel.aggregate();
    let matchQuery = {};
    let dateQuery = {};


    if(params.op){
        matchQuery.op = parseInt(params.op);
    }
    if(params.ops){
        let opsArray = params.ops.split(',');
        let opsParams = []
        opsArray.map((v)=>{
            opsParams.push(parseInt(v))
        })
        matchQuery.op = {$in:opsParams};
    }
    if(params.userId){
        matchQuery.userId = parseInt(params.userId);
    }
    if(params.userType){
        matchQuery.userType = parseInt(params.userType);
    }
    if(params.startDate){
        dateQuery.$gte = new Date(params.startDate+ " 00:00:00");
    }
    if(params.endDate){
        dateQuery.$lte = new Date(params.endDate + " 23:59:59");
    }
    if(dateQuery.$gte!=null || dateQuery.$lte!=null){
        matchQuery.created_on = dateQuery;

    }
    //matchQuery.created_on = {$lte:new Date('2018-10-30')}
    aggregate.match(matchQuery).group({ _id:{userId:"$userId" ,username:'$username'},opCount:{$sum: 1}}).exec((err,rows)=>{
        logger.debug(' getOpRecordStat ') ;
        callback(err,rows);
    })
    /*query.exec((err,rows)=>{
        logger.debug(' getOpRecordStat ') ;
        callback(err,rows);
    })*/
}
const saveOperateRecord =(params,callback)=>{

    var operateObj = new recordModel({
        id : params.carId,
        vin : params.vin ,
        make_id : params.makeId,
        make_name : params.makeName,
        userId : params.userId,
        username : params.username,
        userType : params.userType,
        comment : params.comment,
        op : params.op ,
        created_on : Date.now()
    })
    operateObj.save(function(error,result){
        logger.debug('saveOperateRecord') ;
        callback(error,result);
    })
}
module.exports = {getOperateRecord,saveOperateRecord ,getOpRecordStat};