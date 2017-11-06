'use strict'
const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const serverLogger = require('../util/ServerLogger');
const logger = serverLogger.createLogger('Damage');
const damageDAO = require('../dao/DamageDAO');

const  getDamageRecords =  (req,res,next) => {
    let params = req.params;
    damageDAO.getDamageRecord(params,(error,result)=>{
        if (error) {
            logger.error(' getDamageRecords ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getDamageRecords ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const saveDamageImage = (req,res,next) =>{
    let params = req.params;
    damageDAO.saveDamageImage(params,(error,result)=>{
        if (error) {
            logger.error(' saveDamageImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveDamageImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const createDamageRecord = (req,res,next) => {
    let params = req.params;
    params.comment = [{id:params.userId,name:params.username,type:params.userType,content:params.content,timez: Date.now()}]
    damageDAO.saveDamageRecord(params,(error,result)=>{
        if (error) {
            logger.error(' saveDamageImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveDamageImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    getDamageRecords ,saveDamageImage ,createDamageRecord
}