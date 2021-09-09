'use strict'
const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const serverLogger = require('../util/ServerLogger');
const logger = serverLogger.createLogger('Insure');
const insureDAO = require('../dao/InsureDAO');

const  getInsureRecord =  (req,res,next) => {
    let params = req.params;
    insureDAO.getInsureRecord(params,(error,result)=>{
        if (error) {
            logger.error(' getInsureRecord ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getInsureRecord ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const saveInsureImage = (req,res,next) =>{
    let params = req.params;
    insureDAO.saveInsureImage(params,(error,result)=>{
        if (error) {
            logger.error(' saveInsureImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveInsureImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const removeInsureImage = (req,res,next) =>{
    let params = req.params;
    insureDAO.removeInsureImage(params,(error,result)=>{
        if (error) {
            logger.error(' removeInsureImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeInsureImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    getInsureRecord ,saveInsureImage ,removeInsureImage
}