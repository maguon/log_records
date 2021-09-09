'use strict'
const insureRecord = require('./schema/RecordsSchema.js').insureRecord ;
const q = require('mongoose').query;
const mongoose = require('../db/connection/MongoCon.js').getMongo();
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CarRecordDAO.js');
const recordModel = mongoose.model('insure_record', insureRecord);


const getInsureRecord = (params,callback)=>{

    let query = recordModel.find({}).select('_id id type insure_image comment status created_on');
    if(params.recordId){
        query.where('_id').equals(params.recordId);
    }
    if(params.insureId){
        query.where('id').equals(params.insureId);
    }
    if(params.type){
        query.where('type').equals(params.type);
    }
    if(params.status){
        query.where('status').equals(params.status);
    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.sort('-created_on').exec((err,rows)=>{
        logger.debug(' getInsureRecord ') ;
        callback(err,rows);
    })
}
const saveInsureImage =(params,callback)=>{

    const query = {id:params.insureId,type:params.type};
    const update = { $push: { insure_image: {url:params.url,id:params.userId,name:params.username,type:params.userType,timez: Date.now()} }}
    recordModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        logger.debug(' saveInsureImage ') ;
        callback(error,result);
    })
}

const removeInsureImage = (params,callback) => {
    const recordId = params.recordId;
    const url = params.url;
    try{
        recordModel.findById(recordId).then((doc)=> {
            let index =-1;
            if(doc &&doc.insure_image ){
                for(var i =0;i<doc.insure_image.length;i++){
                    if(doc.insure_image[i].url == url){
                        if(doc.insure_image.length>1){
                            doc.insure_image.splice(i,1);
                        }else{
                            doc.insure_image =[];
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


module.exports = {getInsureRecord,saveInsureImage,removeInsureImage};