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

    server.use(restify.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));
    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('user-name');
    restify.CORS.ALLOW_HEADERS.push('user-type');
    restify.CORS.ALLOW_HEADERS.push('user-id');
    restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","x-requested-with,content-type");
    server.use(restify.CORS());


    server.use(restify.bodyParser({uploadDir:__dirname+'/../uploads/'}));
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.dateParser());
    server.use(restify.authorizationParser());
    server.use(restify.queryParser());
    server.use(restify.gzipResponse());

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
    server.del('/api/user/:userId/record/:recordId/image/:url',carRecord.removeCarImage);
    server.post({path:'/api/car/:carId/vin/:vin/storageImage',contentType: 'application/json'} ,carRecord.saveStorageImage);
    server.post({path:'/api/car/:carId/vin/:vin/record',contentType: 'application/json'} ,carRecord.saveRecord);
    server.get('/api/opRecord',operateRecord.getOperateRecord);
    server.post({path:'/api/opRecord',contentType: 'application/json'} ,operateRecord.saveOperateRecord);

    server.get('/api/user/:userId/truckGps',truck.getTruckGps);

    server.get('/api/user/:userId/truck/:vhe/record',truck.getTruckRecords);
    server.del('/api/user/:userId/record/:recordId/truck/:vhe/image/:url',truck.removeTruckImage);
    server.post({path:'/api/user/:userId/truck/:vhe/image',contentType: 'application/json'} ,truck.saveTruckImage);
    server.post({path:'/api/truck/:vhe/record',contentType: 'application/json'} ,truck.saveTruckRecord);

    server.get('/api/user/:userId/tuser/:tid/record',userBl.getUserRecords);
    server.del('/api/user/:userId/record/:recordId/tuser/:tid/image/:url',userBl.removeUserImage);
    server.post({path:'/api/user/:userId/tuser/:tid/image',contentType: 'application/json'} ,userBl.saveUserImage);
    server.post({path:'/api/tuser/:tid/record',contentType: 'application/json'} ,userBl.saveUserRecords);




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