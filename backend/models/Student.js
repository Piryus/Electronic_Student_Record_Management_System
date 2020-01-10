'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceEventSchema = new Schema({
    date: Date,
    event: {
        type: String,
        enum: ['absence', 'late-entrance', 'early-exit']
    }
});

const gradeSchema = new Schema({
    value: String,
    subject: String,
    description: String,
    date: Date
});

const noteSchema = new Schema({
    teacherId: Schema.Types.ObjectId,
    description: String,
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
    attendanceEvents: [attendanceEventSchema],
    grades: [gradeSchema],
    termGrades: [Object],
    notes: [noteSchema]
});

module.exports = mongoose.model('Student', studentSchema);