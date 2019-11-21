'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const gradeSchema = new Schema({
    value: Number,
    subject: String,
    date: Date
});

const attendanceEventSchema = new Schema({
    date: Date,
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