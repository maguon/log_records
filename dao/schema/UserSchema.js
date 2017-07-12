'use strict'

const mongoose = require('../../db/connection/MongoCon.js').getMongo();
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userEntity = new Schema({
    tid : Number,
    images : Array,
    comments : Array,
    status : Number
})

module.exports = {
    userEntity
}