'use strict';

const mongoose = require('mongoose');
const {Schema} = mongoose;

const classSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Class', classSchema);