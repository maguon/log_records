/**
 * Created by lingxue on 2017/4/14.
 */
'use strict'
const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const serverLogger = require('../util/ServerLogger');
const logger = serverLogger.createLogger('OperateRecord');
const operateRecordDAO = require('../dao/OperateRecordDAO');


const  getOperateRecord =  (req,res,next) => {
    var params = req.params;
    operateRecordDAO.getOperateRecord(params,(error,result)=>{
        if (error) {
            logger.error(' getOperateRecord ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getOperateRecord ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const  getOperateRecordStat =  (req,res,next) => {
    var params = req.params;
    operateRecordDAO.getOpRecordStat(params,(error,result)=>{
        if (error) {
            logger.error(' getOperateRecordStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getOperateRecordStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const saveOperateRecord = (req,res,next) =>{
    var params = req.params;
    operateRecordDAO.saveOperateRecord(params,(error,result)=>{
        if (error) {
            logger.error(' saveOperateRecord ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveOperateRecord ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

module.exports ={getOperateRecord ,saveOperateRecord ,getOperateRecordStat}