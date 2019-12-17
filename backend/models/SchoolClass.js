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
        type: Schema.Types.ObjectId,
        ref: 'File'
    }]
});

const supportMaterialSchema = new Schema({
    subject: String,
    description: String,
    uploaded: {
        type: Date,
        default: Date.now
    },
    attachments: [{
        type: Schema.Types.ObjectId,
        ref: 'File'
    }]
});

const schoolclassSchema = new Schema({
    name: String,
    coordinator: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    assignments: [assignmentSchema],
    supportMaterials: [supportMaterialSchema],
    termsEndings: [Date]
});

module.exports = mongoose.model('SchoolClass', schoolclassSchema);