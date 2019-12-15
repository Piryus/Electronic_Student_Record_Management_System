'use strict';

const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    ssn: String,
    name: String,
    surname: String,
    mail: String,
    password: String,
    scope: [String],
    firstLogin: Boolean
});

module.exports = mongoose.model('User', userSchema);