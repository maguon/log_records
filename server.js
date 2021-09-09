// Copyright (c) 2012 Mark Cavage. All rights reserved.

const fs = require('fs');
const path = require('path');
const util = require('util');

const restify = require('restify');

const sysConfig = require('./config/SystemConfig');
const serverLogger = require('./util/ServerLogger');
const logger = serverLogger.createLogger('Server');
const carRecord = require('./bl/CarRecord');
const operateRecord = require('./bl/OperateRecord');
const truck = require('./bl/Truck');
const userBl = require('./bl/UserBl');
const routeRecord = require('./bl/RouteRecord');
const damage = require('./bl/Damage');
const check = require('./bl/CheckCar');
const receiverRecord = require('./bl/ReceiverRecord');
const entrustRecord = require('./bl/EntrustRecord');
const insure = require('./bl/Insure');

///--- API

/**
 * Returns a server with all routes defined on it
 */
function createServer() {



    // Create a server with our logger and custom formatter
    // Note that 'version' means all routes will default to
    // 1.0.0
    var server = restify.createServer({

        name: 'LOG-API',
        version: '0.0.1'
    });


    // Ensure we don't drop data on uploads
    //server.pre(restify.pre.pause());

    // Clean up sloppy paths like //todo//////1//
    server.pre(restify.pre.sanitizePath());

    // Handles annoying user agents (curl)
    server.pre(restify.pre.userAgentConnection());

    server.use(restify.plugins.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));



    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('user-name');
    restify.CORS.ALLOW_HEADERS.push('user-type');
    restify.CORS.ALLOW_HEADERS.push('user-id');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Origin");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Credentials");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","accept,api-version, content-length, content-md5,x-requested-with,content-type, date, request-id, response-time");
    server.use(restify.CORS());
    // Use the common stuff you probably want
    //hard code the upload folder for now
    server.use(restify.plugins.bodyParser({uploadDir:__dirname+'/../uploads/'}));
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.dateParser());
    server.use(restify.plugins.authorizationParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.gzipResponse());

    // static files: /, /index.html, /images...
    //var STATIS_FILE_RE = /\/?\.css|\/?\.js|\/?\.png|\/?\.jpg|\/?\.gif|\/?\.jpeg|\/?\.less|\/?\.eot|\/?\.svg|\/?\.ttf|\/?\.otf|\/?\.woff|\/?\.pdf|\/?\.ico|\/?\.json|\/?\.wav|\/?\.mp3/;
    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml|woff2|map)$/i;
    server.get(STATIS_FILE_RE, restify.serveStatic({ directory: './public/docs', default: 'index.html', maxAge: 0 }));
//    server.get(/^\/((.*)(\.)(.+))*$/, restify.serveStatic({ directory: './TruMenuWeb', default: "index.html" }));



    server.get(/\.html$/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));
    //For 'abc.html?name=zzz'
    server.get(/\.html\?/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));

    server.get('/api/user/:userId/car/:carId/record',carRecord.getCarRecords);
    server.del('/api/user/:userId/record/:recordId/storageImage/:url',carRecord.removeStorageImage);
    server.del('/api/user/:userId/record/:recordId/carImage/:url',carRecord.removeCarImage);
    server.del('/api/user/:userId/record/:recordId/transImage/:url',carRecord.removeTransImage);
    server.post({path:'/api/car/:carId/vin/:vin/storageImage',contentType: 'application/json'} ,carRecord.saveStorageImage);
    server.post({path:'/api/car/:carId/vin/:vin/carImage',contentType: 'application/json'} ,carRecord.saveCarImage);
    server.post({path:'/api/car/:carId/vin/:vin/transImage',contentType: 'application/json'} ,carRecord.saveTransImage);
    server.post({path:'/api/car/:carId/vin/:vin/video',contentType: 'application/json'} ,carRecord.saveVideo);
    server.post({path:'/api/car/:carId/vin/:vin/record',contentType: 'application/json'} ,carRecord.saveRecord);
    server.get('/api/opRecord',operateRecord.getOperateRecord);
    server.get('/api/opRecordStat',operateRecord.getOperateRecordStat);
    server.get('/api/opRecord.csv',operateRecord.getOperateRecordCsv);
    server.post({path:'/api/opRecord',contentType: 'application/json'} ,operateRecord.saveOperateRecord);

    server.get('/api/user/:userId/truckGps',truck.getTruckGps);

    server.get('/api/user/:userId/truck/:vhe/record',truck.getTruckRecords);
    server.del('/api/user/:userId/record/:recordId/truck/:vhe/image/:url',truck.removeTruckImage);
    server.post({path:'/api/user/:userId/truck/:vhe/image',contentType: 'application/json'} ,truck.saveTruckImage);
    server.post({path:'/api/truckRecord',contentType: 'application/json'} ,truck.saveTruckRecord);

    server.get('/api/user/:userId/tuser/:tid/record',userBl.getUserRecords);
    server.del('/api/user/:userId/record/:recordId/tuser/:tid/image/:url',userBl.removeUserImage);
    server.post({path:'/api/user/:userId/tuser/:tid/image',contentType: 'application/json'} ,userBl.saveUserImage);
    server.post({path:'/api/tuser/:tid/record',contentType: 'application/json'} ,userBl.saveUserRecords);


    server.get('/api/routeRecord',routeRecord.getRouteRecords);
    server.post({path:'/api/routeRecord',contentType: 'application/json'} ,routeRecord.saveRouteRecord);

    server.get('/api/damageRecord',damage.getDamageRecords);
    server.post({path:'/api/user/:userId/damage/:damageId',contentType: 'application/json'} ,damage.createDamageRecord);
    server.post({path:'/api/user/:userId/damage/:damageId/image',contentType: 'application/json'} ,damage.saveDamageImage);
    server.post({path:'/api/user/:userId/damage/:damageId/video',contentType: 'application/json'} ,damage.saveDamageVideo);
    server.del('/api/user/:userId/record/:recordId/damageImage/:url',damage.removeDamageImage);

    server.get('/api/check',check.getCheckRecord);
    server.post({path:'/api/user/:userId/check/:checkId',contentType: 'application/json'} ,check.createCheckRecord);
    server.post({path:'/api/user/:userId/check/:checkId/image',contentType: 'application/json'} ,check.saveCheckImage);
    server.del('/api/user/:userId/record/:recordId/checkImage/:url',check.removeCheckImage);

    server.get('/api/receiverRecord',receiverRecord.getReceiverRecords);
    server.post({path:'/api/receiverRecord',contentType: 'application/json'} ,receiverRecord.saveReceiverRecord);
    server.post({path:'/api/user/:userId/receiver/:receiverId/image',contentType: 'application/json'} ,receiverRecord.saveReceiverImage);
    server.del('/api/user/:userId/record/:recordId/receiverImage/:url',receiverRecord.removeReceiverImage);

    server.get('/api/truckDamage',truck.getTruckDamageRecords);
    server.post({path:'/api/user/:userId/truckDamage/:truckDamageId',contentType: 'application/json'} ,truck.createTruckDamageRecord);
    server.post({path:'/api/user/:userId/truckDamage/:truckDamageId/image',contentType: 'application/json'} ,truck.saveTruckDamageImage);
    server.del('/api/user/:userId/record/:recordId/truckDamageImage/:url',truck.removeTruckDamageImage);

    server.get('/api/truckCheck',truck.getTruckCheckRecords);
    server.post({path:'/api/user/:userId/truckCheck/:truckCheckId',contentType: 'application/json'} ,truck.createTruckCheckRecord);
    server.post({path:'/api/user/:userId/truckCheck/:truckCheckId/image',contentType: 'application/json'} ,truck.saveTruckCheckImage);
    server.del('/api/user/:userId/record/:recordId/truckCheckImage/:url',truck.removeTruckCheckImage);


    server.get('/api/entrustRecord',entrustRecord.getEntrustRecord);
    server.post({path:'/api/entrust/:entrustId/cityRouteId/:cityRouteId/entrustRecord',contentType: 'application/json'} ,entrustRecord.saveEntrustRecord);
    
    server.get('/api/insure',insure.getInsureRecord);
    server.post({path:'/api/user/:userId/insure/:insureId/image',contentType: 'application/json'} ,insure.saveInsureImage);
    server.del('/api/user/:userId/record/:recordId/insureImage/:url',insure.removeInsureImage);


    server.on('NotFound', function (req, res, next) {
        logger.warn(req.url + " not found");
        res.send(404,{success:false,msg:" service not found !"});
        next();
    });
    return (server);

}



///--- Exports

module.exports = {
    createServer: createServer
};