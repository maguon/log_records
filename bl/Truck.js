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

const  getTruckRecords =  (req,res,next) => {
    let params = req.params;
    truckDAO.getTruckRecords(params,(error,result)=>{
        if (error) {
            logger.error(' getTruckRecords ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getTruckRecords ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


const saveTruckImage = (req,res,next) =>{
    let params = req.params;
    truckDAO.saveTruckImage(params,(error,result)=>{
        if (error) {
            logger.error(' saveTruckImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveTruckImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const saveTruckRecord = (req,res,next) =>{
    let params = req.params;
    params.comment = params.content;
    /*operateRecordDAO.saveOperateRecord(params,(error,result)=>{
        if(error){
            logger.error(' saveOperateRecord ' + error.message);
        }
    })*/
    truckDAO.saveTruckRecord(params,(error,result)=>{
        if (error) {
            logger.error(' saveTruckRecord ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveTruckRecord ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
};

const removeTruckImage = (req,res,next) =>{
    let params = req.params;
    truckDAO.removeTruckImage(params,(error,result)=>{
        if (error) {
            logger.error(' removeTruckImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeTruckImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

module.exports ={
    getTruckGps ,getTruckRecords ,saveTruckImage , saveTruckRecord , removeTruckImage
}