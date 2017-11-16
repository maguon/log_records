'use strict'
const damageRecord = require('./schema/RecordsSchema.js').damageRecord ;
const q = require('mongoose').query;
const sysConfig = require('../config/SystemConfig.js');
const mongoose = require('../db/connection/MongoCon.js').getMongo();
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CarRecordDAO.js');
const recordModel = mongoose.model('damage_record', damageRecord);


const getDamageRecord = (params,callback)=>{

    let query = recordModel.find({}).select('_id vin id damage_image comment status created_on');
    if(params.recordId){
        query.where('_id').equals(params.recordId);
    }
    if(params.damageId){
        query.where('id').equals(params.damageId);
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
        logger.debug(' getDamageRecord ') ;
        callback(err,rows);
    })
}
const saveDamageImage =(params,callback)=>{

    const query = {id:params.damageId};
    const update = { $push: { damage_image: {url:params.url,id:params.userId,name:params.username,type:params.userType,timez: Date.now()} }}
    recordModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        logger.debug(' saveDamageImage ') ;
        callback(error,result);
    })
}

const saveDamageRecord =(params,callback)=>{
    var operateObj = new recordModel({
        id : params.damageId,
        vin : params.vin ,
        comment : params.comment,
        created_on : Date.now()
    })
    operateObj.save(function(error,result){
        logger.debug('saveDamageRecord') ;
        callback(error,result);
    })
}

const removeDamageImage = (params,callback) => {
    const recordId = params.recordId;
    const url = params.url;
    try{
        recordModel.findById(recordId).then((doc)=> {
            let index =-1;
            if(doc &&doc.damage_image ){
                for(var i =0;i<doc.damage_image.length;i++){
                    if(doc.damage_image[i].url == url){
                        if(doc.damage_image.length>1){
                            doc.damage_image.splice(i,1);
                        }else{
                            doc.damage_image =[];
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


module.exports = {getDamageRecord,saveDamageImage,saveDamageRecord,removeDamageImage};