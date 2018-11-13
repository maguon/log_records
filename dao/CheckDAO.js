'use strict'
const checkRecord = require('./schema/RecordsSchema.js').checkRecord ;
const q = require('mongoose').query;
const sysConfig = require('../config/SystemConfig.js');
const mongoose = require('../db/connection/MongoCon.js').getMongo();
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CheckDAO.js');
const recordModel = mongoose.model('check_record', checkRecord);


const getCheckRecord = (params,callback)=>{

    let query = recordModel.find({}).select('_id car_no id check_image comment status created_on');
    if(params.recordId){
        query.where('_id').equals(params.recordId);
    }
    if(params.checkId){
        query.where('id').equals(params.checkId);
    }
    if(params.status){
        query.where('status').equals(params.status);
    }
    if(params.carNo){
        var regString = new RegExp(params.carNo);
        query.or([{car_no:regString}])
    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.sort('-created_on').exec((err,rows)=>{
        logger.debug(' getCheckRecord ') ;
        callback(err,rows);
    })
}
const saveCheckImage =(params,callback)=>{

    const query = {id:params.checkId,car_no:params.carNo};
    const update = { $push: { check_image: {url:params.url,id:params.userId,name:params.username,type:params.userType,timez: Date.now()} }}
    recordModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        logger.debug(' saveCheckImage ') ;
        callback(error,result);
    })
}

const saveCheckRecord =(params,callback)=>{
    let operateObj = new recordModel({
        id : params.checkId,
        car_no : params.carNo ,
        comment : params.comment,
        created_on : Date.now()
    })
    operateObj.save(function(error,result){
        logger.debug('saveCheckRecord') ;
        callback(error,result);
    })
}

const removeCheckImage = (params,callback) => {
    const recordId = params.recordId;
    const url = params.url;
    try{
        recordModel.findById(recordId).then((doc)=> {
            let index =-1;
            if(doc &&doc.record_image ){
                for(var i =0;i<doc.record_image.length;i++){
                    if(doc.record_image[i].url == url){
                        if(doc.record_image.length>1){
                            doc.record_image.splice(i,1);
                        }else{
                            doc.record_image =[];
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


module.exports = {getCheckRecord,saveCheckImage,saveCheckRecord,removeCheckImage};