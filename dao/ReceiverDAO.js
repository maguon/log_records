'use strict'
const receiverRecord = require('./schema/RecordsSchema.js').receiverRecord ;
const q = require('mongoose').query;
const mongoose = require('../db/connection/MongoCon.js').getMongo();
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CarRecordDAO.js');
const recordModel = mongoose.model('receiver_record', receiverRecord);


const getReceiverRecord = (params,callback)=>{

    let query = recordModel.find({}).select('_id id receiver_image comment status created_on');
    if(params.recordId){
        query.where('_id').equals(params.recordId);
    }
    if(params.receiverId){
        query.where('id').equals(params.receiverId);
    }
    if(params.status){
        query.where('status').equals(params.status);
    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.sort('-created_on').exec((err,rows)=>{
        logger.debug(' getReceiverRecord ') ;
        callback(err,rows);
    })
}
const saveReceiverImage =(params,callback)=>{

    const query = {id:params.receiverId};
    const update = { $push: { receiver_image: {url:params.url,id:params.userId,name:params.username,type:params.userType,timez: Date.now()} }}
    recordModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        logger.debug(' saveReceiverImage ') ;
        callback(error,result);
    })
}

const saveReceiverRecord =(params,callback)=>{
    const query = {id:params.receiverId};
    const update = { $push: { comment: {id:params.userId,name:params.username,type:params.userType,op:params.op,content:params.content,timez: Date.now()} }}
    recordModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        logger.debug(' saveReceiverRecord ') ;
        callback(error,result);
    })
}

const removeReceiverImage = (params,callback) => {
    const recordId = params.recordId;
    const url = params.url;
    try{
        recordModel.findById(recordId).then((doc)=> {
            let index =-1;
            if(doc &&doc.receiver_image ){
                for(var i =0;i<doc.receiver_image.length;i++){
                    if(doc.receiver_image[i].url == url){
                        if(doc.receiver_image.length>1){
                            doc.receiver_image.splice(i,1);
                        }else{
                            doc.receiver_image =[];
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


module.exports = {getReceiverRecord,saveReceiverImage,saveReceiverRecord,removeReceiverImage};