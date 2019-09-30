/**
 * Created by lingxue on 2017/4/13.
 */
'use strict'
const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const serverLogger = require('../util/ServerLogger');
const logger = serverLogger.createLogger('CarRecord');
const carRecordDAO = require('../dao/CarRecordDAO');
const operateRecordDAO = require('../dao/OperateRecordDAO');




const  getCarRecords =  (req,res,next) => {
    let params = req.params;
    carRecordDAO.getCarRecords(params,(error,result)=>{
        if (error) {
            logger.error(' getCarRecords ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getCarRecords ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const saveStorageImage = (req,res,next) =>{
    let params = req.params;
    carRecordDAO.saveStorageImage(params,(error,result)=>{
        if (error) {
            logger.error(' saveStorageImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveStorageImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const saveCarImage = (req,res,next) =>{
    let params = req.params;
    carRecordDAO.saveCarImage(params,(error,result)=>{
        if (error) {
            logger.error(' saveCarImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveCarImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const saveTransImage = (req,res,next) =>{
    let params = req.params;
    carRecordDAO.saveTransImage(params,(error,result)=>{
        if (error) {
            logger.error(' saveTransImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveTransImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const saveVideo = (req,res,next) =>{
    let params = req.params;
    carRecordDAO.saveVideo(params,(error,result)=>{
        if (error) {
            logger.error(' saveVideo ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveVideo ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const saveRecord = (req,res,next) =>{
    let params = req.params;
    params.comment = params.content;
    if(params.unique ==1){
        let subParams = {op:params.op,carId:params.carId,vin:params.vin};
        operateRecordDAO.getOperateRecord(subParams,(err,result)=>{

            if(err){
                logger.error(' saveRecord ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                if(result && result.length>0){
                    logger.error(' saveRecord ' + sysMsg.SYS_INTERNAL_ERROR_MSG );
                    throw sysError.InvalidArgumentError(sysMsg.SYS_INTERNAL_ERROR_MSG,sysMsg.SYS_DUPLICATE_ERROR_MSG);
                }else{
                    operateRecordDAO.saveOperateRecord(params,(error,result)=>{
                        if(error){
                            logger.error(' saveOperateRecord ' + error.message);
                        }
                    })
                    carRecordDAO.saveRecord(params,(error,result)=>{
                        if (error) {
                            logger.error(' saveRecord ' + error.message);
                            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                        } else {
                            logger.info(' saveRecord ' + 'success');
                            resUtil.resetQueryRes(res,result,null);
                            return next();
                        }
                    })
                }
            }
        })
    }else{
        operateRecordDAO.saveOperateRecord(params,(error,result)=>{
            if(error){
                logger.error(' saveOperateRecord ' + error.message);
            }
        })
        carRecordDAO.saveRecord(params,(error,result)=>{
            if (error) {
                logger.error(' saveRecord ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' saveRecord ' + 'success');
                resUtil.resetQueryRes(res,result,null);
                return next();
            }
        })
    }

};

const removeStorageImage = (req,res,next) =>{
    let params = req.params;
    carRecordDAO.removeStorageImage(params,(error,result)=>{
        if (error) {
            logger.error(' removeStorageImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeStorageImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const removeCarImage = (req,res,next) =>{
    let params = req.params;
    carRecordDAO.removeCarImage(params,(error,result)=>{
        if (error) {
            logger.error(' removeCarImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeCarImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const removeTransImage = (req,res,next) =>{
    let params = req.params;
    carRecordDAO.removeTransImage(params,(error,result)=>{
        if (error) {
            logger.error(' removeTransImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeTransImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

module.exports = {getCarRecords,saveStorageImage ,saveCarImage ,saveTransImage,saveRecord,removeStorageImage , removeCarImage,removeTransImage,saveVideo};