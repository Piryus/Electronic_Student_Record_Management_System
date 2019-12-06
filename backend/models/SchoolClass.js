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
    due: Date,
    attachments: [{
        type: mongoose.Types.ObjectId,
        ref: 'File'
    }]
});

const supportMaterialSchema = new Schema({
    subject: String,
    uploaded: {
        type: Date,
        default: Date.now
    },
    attachments: [Schema.Types.ObjectId]
});

const schoolclassSchema = new Schema({
    name: String,
    assignments: [assignmentSchema],
    supportMaterials: [supportMaterialSchema]
});

module.exports = mongoose.model('SchoolClass', schoolclassSchema);