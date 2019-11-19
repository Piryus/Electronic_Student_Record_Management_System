'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const gradeSchema = new Schema({
    value: Number,
    subject: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const studentSchema = new Schema({
    ssn: String,
    name: String,
    surname: String,
    classId: Schema.Types.ObjectId,
    grades: [gradeSchema]
});

module.exports = mongoose.model('Student', studentSchema);