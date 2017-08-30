'use strict'
const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const serverLogger = require('../util/ServerLogger');
const logger = serverLogger.createLogger('RouteRecord');
const routeRecordDAO = require('../dao/RouteRecordDAO');

const  getRouteRecords =  (req,res,next) => {
    let params = req.params;
    routeRecordDAO.getRouteRecord(params,(error,result)=>{
        if (error) {
            logger.error(' getRouteRecords ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getRouteRecords ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const saveRouteRecord = (req,res,next) =>{
    let params = req.params;
    routeRecordDAO.saveRouteRecord(params,(error,result)=>{
        if (error) {
            logger.error(' saveRouteRecord ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveRouteRecord ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

module.exports = {
    getRouteRecords ,saveRouteRecord
}