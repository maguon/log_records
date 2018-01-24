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
    storage_image: {type: Array},
    comment : {type: Array},
    status : Number,
    created_on : {type:Date ,default : Date.now()}
});

const damageRecord = new Schema({
    vin : String,
    id : Number ,
    damage_image: {type: Array},
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

module.exports = {carRecord,operateRecord,routeRecord,damageRecord ,receiverRecord}