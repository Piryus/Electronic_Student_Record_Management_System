'use strict';

const mongoose = require('mongoose');
const {Schema} = mongoose;

const schoolclassSchema = new Schema({
    name: String
});

module.exports = mongoose.model('SchoolClass', schoolclassSchema);