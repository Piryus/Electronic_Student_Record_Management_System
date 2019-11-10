'use strict';

const mongoose = require('mongoose');
const {Schema} = mongoose;

const parentSchema = new Schema({
    userId: Schema.Types.ObjectId,
    name: String,
    surname: String,
    children: Array
});

module.exports = mongoose.model('Parent', parentSchema);