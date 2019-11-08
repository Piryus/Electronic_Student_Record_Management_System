'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const timetableEntrySchema = new Schema({
    weekhour: String,
    classId: Schema.Types.ObjectId
});

const teacherSchema = new Schema({
    name: String,
    surname: String,
    userId: Schema.Types.ObjectId,
    subjects: [String],
    timetable: [timetableEntrySchema]
});

module.exports = mongoose.model('Teacher', teacherSchema);