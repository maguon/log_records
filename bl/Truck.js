'use strict'
const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const serverLogger = require('../util/ServerLogger');
const logger = serverLogger.createLogger('Truck');
const truckDAO = require('../dao/TruckDAO');

const  getTruckGps =  (req,res,next) => {
    var params = req.params;
    truckDAO.getTruckGps(params,(error,result)=>{
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

module.exports ={
    getTruckGps
}