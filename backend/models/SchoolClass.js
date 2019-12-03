'use strict';

const mongoose = require('mongoose');
const {Schema} = mongoose;

const assignmentSchema = new Schema({
    subject: String,
    description: String,
    assigned: {
        type: Date,
        default: Date.now
    },
    due: Date
});

const schoolclassSchema = new Schema({
    name: String,
    assignments: [assignmentSchema]
});

module.exports = mongoose.model('SchoolClass', schoolclassSchema);