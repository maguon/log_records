'use strict'
const mongoose = require('../db/connection/MongoCon.js').getMongo();
const sysConfig = require('../config/SystemConfig');
const truckEntity = require('./schema/TruckSchema.js').truckEntity ;
const truckModel = mongoose.model('truck_gps', truckEntity);
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('TruckDAO.js');


const getTruckGps = (params,callback)=>{
    let query = truckModel.find({}).select('_id sim vhe_no lat lon vel oil angle mileage updated_on');
    if(params.truckId){
        query.where('_id').equals(params.truckId);
    }
    if(params.truckNumber){
        query.where('vhe_no').equals(params.truckNumber);
    }
    if(params.sim){
        query.where('sim').equals(params.sim);
    }
    if(params.start&&params.size){
        query.skip(parseInt(params.start)).limit(parseInt(params.size));
    }
    query.exec((err,rows)=>{
        logger.debug(' getTruckGps ') ;
        callback(err,rows);
    })
}

module.exports = {
    getTruckGps
}