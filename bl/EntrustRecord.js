'use strict'
const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const serverLogger = require('../util/ServerLogger');
const logger = serverLogger.createLogger('EntrustRecord');
const entrustRecordDAO = require('../dao/EntrustRecordDAO');

const  getEntrustRecord =  (req,res,next) => {
    let params = req.params;
    entrustRecordDAO.getEntrustRecord(params,(error,result)=>{
        if (error) {
            logger.error(' getEntrustRecord ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getEntrustRecord ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const saveEntrustRecord = (req,res,next) =>{
    let params = req.params;
    params.comment = params.content;
    entrustRecordDAO.saveEntrustRecord(params,(error,result)=>{
        if (error) {
            logger.error(' saveEntrustRecord ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveEntrustRecord ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
};

module.exports = {
    getEntrustRecord ,
    saveEntrustRecord
}