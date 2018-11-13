'use strict'
const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const serverLogger = require('../util/ServerLogger');
const logger = serverLogger.createLogger('CheckCar');
const checkDAO = require('../dao/CheckDAO');

const  getCheckRecord =  (req,res,next) => {
    let params = req.params;
    checkDAO.getCheckRecord(params,(error,result)=>{
        if (error) {
            logger.error(' getCheckRecord ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getCheckRecord ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const saveCheckImage = (req,res,next) =>{
    let params = req.params;
    checkDAO.saveCheckImage(params,(error,result)=>{
        if (error) {
            logger.error(' saveCheckImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveCheckImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const createCheckRecord = (req,res,next) => {
    let params = req.params;
    params.comment = [{id:params.userId,name:params.username,type:params.userType,content:params.content,timez: Date.now()}]
    checkDAO.saveCheckRecord(params,(error,result)=>{
        if (error) {
            logger.error(' createCheckRecord ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCheckRecord ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const removeCheckImage = (req,res,next) =>{
    let params = req.params;
    checkDAO.removeCheckImage(params,(error,result)=>{
        if (error) {
            logger.error(' removeCheckImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeCheckImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    getCheckRecord ,saveCheckImage ,createCheckRecord ,removeCheckImage
}