'use strict'
const mongoose = require('../db/connection/MongoCon.js').getMongo();
const sysConfig = require('../config/SystemConfig');
const userEntity = require('./schema/UserSchema.js').userEntity ;
const userModel = mongoose.model('user_info', userEntity);
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserDAO.js');


const getUserRecords = (params,callback)=>{

    let query = userModel.find({}).select('_id tid images comments status');
    if(params.recordId){
        query.where('_id').equals(params.recordId);
    }
    if(params.status){
        query.where('status').equals(params.status);
    }
    if(params.tid){
        query.where('tid').equals(params.tid);
    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.exec((err,rows)=>{
        logger.debug(' getUserRecords ') ;
        callback(err,rows);
    })
}


const saveUserImage =(params,callback)=>{

    const query = {tid:params.tid};
    const update = { $push: { images: {url:params.url,id:params.userId,name:params.username,type:params.userType,timez: Date.now()} }}
    userModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        callback(error,result);
    })
}

const saveUserkRecord =(params,callback)=>{

    const query = {tid:params.tid};
    const update = { $push: { comments: {id:params.userId,name:params.username,type:params.userType,op:params.op,content:params.content,timez: Date.now()} }}
    userModel.findOneAndUpdate(query,update,{upsert:true},function(error,result){
        callback(error,result);
    })
}

const removeUserImage = (params,callback) => {
    const recordId = params.recordId;
    const url = params.url;
    try{
        userModel.findById(recordId).then((doc)=> {
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
            //callback(null,doc)
        }).catch((error)=>{
            //console.log(error.stack);
            callback(error,null)
        })
    }catch (e){
        callback(e,null)
    }

}


module.exports ={
    getUserRecords , saveUserImage ,saveUserkRecord , removeUserImage
}