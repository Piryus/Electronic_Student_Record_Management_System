'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const timetableEntrySchema = new Schema({
    weekhourId: String,
    classId: ObjectId
});

const teacherSchema = new Schema({
    name: String,
    surname: String,
    subjects: [String],
    timetable: [timetableEntrySchema]
});

module.exports = mongoose.model('Teacher', teacherSchema);