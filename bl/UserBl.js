'use strict'
const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const serverLogger = require('../util/ServerLogger');
const logger = serverLogger.createLogger('UserBl');
const userDAO = require('../dao/UserDAO');


const  getUserRecords =  (req,res,next) => {
    let params = req.params;
    userDAO.getUserRecords(params,(error,result)=>{
        if (error) {
            logger.error(' getUserRecords ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getUserRecords ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


const saveUserImage = (req,res,next) =>{
    let params = req.params;
    userDAO.saveUserImage(params,(error,result)=>{
        if (error) {
            logger.error(' saveUserImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveUserImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

const saveUserRecords = (req,res,next) =>{
    let params = req.params;
    params.comment = params.content;

    userDAO.saveUserkRecord(params,(error,result)=>{
        if (error) {
            logger.error(' saveUserRecords ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' saveUserRecords ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
};

const removeUserImage = (req,res,next) =>{
    let params = req.params;
    userDAO.removeUserImage(params,(error,result)=>{
        if (error) {
            logger.error(' removeUserImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeUserImage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

module.exports ={
    getUserRecords , saveUserImage , saveUserRecords , removeUserImage
}