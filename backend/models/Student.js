'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const gradeSchema = new Schema({
    value: String,
    subject: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const attendanceEventSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    event: {
        type: String,
        enum: ['absence', 'late-entry', 'early-exit']
    }
});

const studentSchema = new Schema({
    ssn: String,
    name: String,
    surname: String,
    classId: Schema.Types.ObjectId,
    attendanceEvents: [attendanceEventSchema],
    grades: [gradeSchema]
});

module.exports = mongoose.model('Student', studentSchema);