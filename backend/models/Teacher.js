'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const timetableEntrySchema = new Schema({
    classId: Schema.Types.ObjectId,
    subject: String,
    weekhour: String
});

const teacherSchema = new Schema({
    userId: Schema.Types.ObjectId,
    subjects: [String],
    timetable: [timetableEntrySchema]
});

module.exports = mongoose.model('Teacher', teacherSchema);