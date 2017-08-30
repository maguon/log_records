/**
 * Created by lingxue on 2017/4/12.
 */
'use strict'
const carRecord = require('./schema/RecordsSchema.js').carRecord ;
const q = require('mongoose').query;
const sysConfig = require('../config/SystemConfig.js');
const mongoose = require('../db/connection/MongoCon.js').getMongo();
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CarRecordDAO.js');
const recordModel = mongoose.model('car_record', carRecord);


const getCarRecords = (params,callback)=>{

    let query = recordModel.find({}).select('_id vin id storage_image comment status created_on');
    if(params.recordId){
        query.where('_id').equals(params.recordId);
    }
    if(params.carId){
        query.where('id').equals(params.carId);
    }
    if(params.status){
     query.where('status').equals(params.status);
     }
    if(params.vin){
        var regString = new RegExp(params.vin);
        query.or([{vin:regString}])
    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.sort('-created_on').exec((err,rows)=>{
        logger.debug(' getCarRecords ') ;
        callback(err,rows);
    })
}

const saveStorageImage =(params,callback)=>{

    const query = {id:params.carId,vin:params.vin};
    const update = { $push: { storage_image: {url:params.url,id:params.userId,name:params.username,type:params.userType,timez: Date.now()} }}
    recordModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        logger.debug(' saveStorageImage ') ;
        callback(error,result);
    })
}

const saveRecord =(params,callback)=>{

    const query = {id:params.carId,vin:params.vin};
    const update = { $push: { comment: {id:params.userId,name:params.username,type:params.userType,op:params.op,content:params.content,timez: Date.now()} }}
    recordModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        logger.debug(' saveRecord ') ;
        callback(error,result);
    })
}

const removeStorageImage = (params,callback) => {
    const recordId = params.recordId;
    const url = params.url;
    try{
        recordModel.findById(recordId).then((doc)=> {
            let index =-1;
            if(doc &&doc.storage_image ){
                for(var i =0;i<doc.storage_image.length;i++){
                    if(doc.storage_image[i].url == url){
                        if(doc.storage_image.length>1){
                            doc.storage_image.splice(i,1);
                        }else{
                            doc.storage_image =[];
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

            //callback(null,doc)
        }).catch((error)=>{
            //console.log(error.stack);
            callback(error,null)
        })
    }catch (e){
        callback(e,null)
    }

}

module.exports = {
    getCarRecords ,saveStorageImage,saveRecord,removeStorageImage
}