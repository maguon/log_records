'use strict'
const mongoose = require('../db/connection/MongoCon.js').getMongo();
const sysConfig = require('../config/SystemConfig');
const truckEntity = require('./schema/TruckSchema.js').truckEntity ;
const truckInfoEntity = require('./schema/TruckSchema.js').truckInfoEntity ;
const opTruckEntity = require('./schema/TruckSchema.js').opTruckEntity ;
const truckModel = mongoose.model('truck_gps', truckEntity);
const truckInfoModel = mongoose.model('truck_info', truckInfoEntity);
const opTruckModel = mongoose.model('truck_op', opTruckEntity);
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('TruckDAO.js');


const getTruckGps = (params,callback)=>{
    let query = truckModel.find({}).select('_id sim vhe_no lat lon vel oil angle mileage updated_on');
    if(params.truckId){
        query.where('_id').equals(params.truckId);
    }
    if(params.truckNumber){
        query.where('vhe_no').equals(params.truckNumber);
    }
    if(params.sim){
        query.where('sim').equals(params.sim);
    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.exec((err,rows)=>{
        logger.debug(' getTruckGps ') ;
        callback(err,rows);
    })
}

const getTruckRecords = (params,callback)=>{

    let query = truckInfoModel.find({}).select('_id vhe images comments status');
    if(params.recordId){
        query.where('_id').equals(params.recordId);
    }
    if(params.status){
        query.where('status').equals(params.status);
    }
    if(params.vhe){
        /*var regString = new RegExp(params.vhe);
        query.or([{vhe:regString}])*/
        query.where('vhe').equals(params.vhe);

    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.exec((err,rows)=>{
        logger.debug(' getTruckRecords ') ;
        callback(err,rows);
    })
}


const saveTruckImage =(params,callback)=>{

    const query = {vhe:params.vhe};
    const update = { $push: { images: {url:params.url,id:params.userId,name:params.username,type:params.userType,timez: Date.now()} }}
    truckInfoModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        callback(error,result);
    })
}

const saveTruckRecord =(params,callback)=>{

    const query = {vhe:params.vhe};
    const update = { $push: { comments: {id:params.userId,name:params.username,type:params.userType,op:params.op,content:params.content,timez: Date.now()} }}
    truckInfoModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        callback(error,result);
    })
}

const removeTruckImage = (params,callback) => {
    const recordId = params.recordId;
    const url = params.url;
    try{
        truckInfoModel.findById(recordId).then((doc)=> {
            console.log(doc);
            let index =-1;
            if(doc &&doc.images ){
                for(var i =0;i<doc.images.length;i++){
                    if(doc.images[i].url == url){
                        if(doc.images.length>1){
                            doc.images.splice(i,1);
                        }else{
                            doc.images =[];
                        }
                        break;
                    }
                }
                doc.save().then(doc=>{
                    callback(null,doc)
                }).catch((error)=>{
                    callback(error,null)
                })
            }else{
                callback(null,[])
            }
        }).catch((error)=>{
            callback(error,null)
        })
    }catch (e){
        callback(e,null)
    }

}

const getOperateTruckRecord = (params,callback)=>{

    let query = opTruckModel.find({}).select('_id vhe  userId username userType comment op created');
    if(params.recordId){
        query.where('_id').equals(params.recordId);
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
    if(params.vhe){
        var regString = new RegExp(params.vhe);
        query.or([{vhe:regString}])
    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.sort('-created').exec((err,rows)=>{
        logger.debug(' getOperateTruckRecord ') ;
        callback(err,rows);
    })
}
const saveOperateTruckRecord =(params,callback)=>{

    var operateObj = new opTruckEntity({
        vhe : params.vhe ,
        userId : params.userId,
        username : params.username,
        userType : params.userType,
        comment : params.comment,
        op : params.op ,
        created : Date.now()
    })
    operateObj.save(function(error,result){
        logger.debug('saveOperateTruckRecord') ;
        callback(error,result);
    })
}
module.exports = {
    getTruckGps ,getTruckRecords , saveTruckImage ,saveTruckRecord ,removeTruckImage ,
    getOperateTruckRecord , saveOperateTruckRecord
}