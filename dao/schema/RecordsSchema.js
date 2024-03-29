/**
 * Created by lingxue on 2017/4/12.
 */
'use strict'


const mongoose = require('../../db/connection/MongoCon.js').getMongo();
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const carRecord = new Schema({
    vin : String,
    id : Number ,
    car_image: {type: Array},
    storage_image: {type: Array},
    trans_image: {type: Array},
    video: {type: Array},
    comment : {type: Array},
    status : Number,
    created_on : {type:Date ,default : Date.now()}
});

const damageRecord = new Schema({
    vin : String,
    id : Number ,
    damage_image: {type: Array},
    damage_video: {type: Array},
    comment : {type: Array},
    status : Number,
    created_on : {type:Date ,default : Date.now()}
});

const checkRecord = new Schema({
    car_no : String,
    id : Number ,
    check_image: {type: Array},
    comment : {type: Array},
    status : Number,
    created_on : {type:Date ,default : Date.now()}
});
const operateRecord = new Schema({
    userId:Number,
    username:String,
    userType:Number,
    id:Number,
    vin:String,
    make_id:Number,
    make_name:String,
    op:Number,
    comment:String,
    created_on : {type:Date ,default : Date.now()}
})

const routeRecord = new Schema({
    id : Number ,
    comment : {type: Array},
    status : Number,
    created_on : {type:Date ,default : Date.now()}
})

const receiverRecord = new Schema({
    id:Number,
    comment :{type:Array},
    receiver_image:{type:Array},
    status : Number,
    created_on : {type:Date,default:Date.now()}
})

const truckDamageRecord = new Schema({
    vhe_no : String,
    id : Number ,
    damage_image: {type: Array},
    comment : {type: Array},
    status : Number,
    created_on : {type:Date ,default : Date.now()}
});

const entrustRecord  = new Schema({
    entrust_id : Number ,
    city_route_id : Number ,
    comment : {type:Array},
    created_on : {type:Date ,default : Date.now()}
})

const truckCheckRecord = new Schema({
    vhe_no : String,
    id : Number ,
    check_image: {type: Array},
    comment : {type: Array},
    status : Number,
    created_on : {type:Date ,default : Date.now()}
});

const insureRecord = new Schema({
    id : Number ,
    type : Number ,
    insure_image: {type: Array},
    comment : {type: Array},
    status : Number,
    created_on : {type:Date ,default : Date.now()}
});
module.exports = {carRecord,operateRecord,routeRecord,damageRecord ,receiverRecord ,truckDamageRecord ,entrustRecord,checkRecord ,truckCheckRecord,insureRecord}