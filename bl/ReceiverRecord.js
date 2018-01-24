'use strict'
const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const serverLogger = require('../util/ServerLogger');
const logger = serverLogger.createLogger('Damage');
const receiverDAO = require('../dao/ReceiverDAO');

const  getReceiverRecords =  (req,res,next) => {
    let params = req.params;
    receiverDAO.getReceiverRecord(params,(error,result)=>{
        if (error) {
            logger.error(' getReceiverRecords ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getReceiverRecords ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const saveReceiverImage = (req,res,next) =>{
    let params = req.params;
    receiverDAO.saveReceiverImage(params,(error,result)=>{
        if (error) {
            logger.error(' saveReceiverImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveReceiverImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const saveReceiverRecord = (req,res,next) => {
    let params = req.params;
    params.comment = [{id:params.userId,name:params.username,type:params.userType,content:params.content,timez: Date.now()}]
    receiverDAO.saveReceiverRecord(params,(error,result)=>{
        if (error) {
            logger.error(' saveReceiverRecord ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveReceiverRecord ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const removeReceiverImage = (req,res,next) =>{
    let params = req.params;
    receiverDAO.removeReceiverImage(params,(error,result)=>{
        if (error) {
            logger.error(' removeReceiverImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeReceiverImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    getReceiverRecords ,saveReceiverImage ,saveReceiverRecord ,removeReceiverImage
}