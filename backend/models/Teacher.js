'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const timetableEntrySchema = new Schema({
    weekhour: String,
    classId: Schema.Types.ObjectId
});

const teacherSchema = new Schema({
    userId: Schema.Types.ObjectId,
    name: String,
    surname: String,
    subjects: [String],
    timetable: [timetableEntrySchema]
});

module.exports = mongoose.model('Teacher', teacherSchema);