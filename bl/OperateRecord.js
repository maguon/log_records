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
    const params = req.params;
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
    const params = req.params;
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

const  getOperateRecordCsv = (req,res,next) =>{
    const params = req.params;

    const header = "VIN" + ',' + "ID" + ',' + "Name" + ',' + "Comment" + ','+ "Time" ;
    let csvString = "";
    csvString = header + '\r\n'+csvString;
    operateRecordDAO.getOperateRecord(params,(error,result)=>{
        if (error) {
            logger.error(' getOperateRecordCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getOperateRecordCsv ' + 'success');
            for(let i=0;i<result.length;i++){
                /*let csvObj = {};
                csvObj.vin = result[i].vin;
                csvObj.ID = result[i].userId;
                csvObj.name = result[i].username;
                csvObj.comment = result[i].comment;
                csvObj.time = new Date(result[i].created_on).toLocaleString();*/
                csvString = csvString + result[i].vin +","+result[i].userId +","
                    + result[i].username +","+  result[i].comment +","+ new Date(result[i].created_on).toLocaleString() + '\r\n';
            }
            let csvBuffer = new Buffer(csvString,'utf8');
            res.set('content-type', 'application/csv');
            res.set('charset', 'utf8');
            res.set('content-length', csvBuffer.length);
            res.writeHead(200);
            res.write(csvBuffer);//TODO
            res.end();
            return next(false);
        }
    })

}

const saveOperateRecord = (req,res,next) =>{
    const params = req.params;
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

module.exports ={getOperateRecord ,saveOperateRecord ,getOperateRecordStat ,getOperateRecordCsv}