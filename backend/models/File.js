'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema({
    filename: String,
    bytes: Number,
    type: String
});

module.exports = mongoose.model('File', fileSchema);