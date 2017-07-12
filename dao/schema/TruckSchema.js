'use strict'

const mongoose = require('../../db/connection/MongoCon.js').getMongo();
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const truckEntity = new Schema({
    vhe_no : String,
    sim : String ,
    lat: Number,
    lon : Number,
    vel : Number,
    angle : Number,
    oil : Number,
    mileage : Number,
    updated_on : Date
});

const truckInfoEntity = new Schema({
    vhe : String,
    images : Array,
    comments : Array,
    status : Number
})

const opTruckEntity = new Schema({
    userId:Number,
    username:String,
    userType:Number,
    vhe:String,
    op:Number,
    comment:String,
    created : {type:Date ,default : Date.now()}
});

module.exports = {truckEntity ,truckInfoEntity ,opTruckEntity }