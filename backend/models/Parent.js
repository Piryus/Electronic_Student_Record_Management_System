'use strict';

const mongoose = require('mongoose');
const {Schema} = mongoose;

const parentSchema = new Schema({
    userId: Schema.Types.ObjectId,
    ssn: String,
    name: String,
    surname: String,
    children: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Parent', parentSchema);