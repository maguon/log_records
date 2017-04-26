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
    var params = req.params;
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
    var params = req.params;
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

const saveRecord = (req,res,next) =>{
    var params = req.params;
    params.comment = params.content;
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

module.exports = {getCarRecords,saveStorageImage,saveRecord};