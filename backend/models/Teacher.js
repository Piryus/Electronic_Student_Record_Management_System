'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const timetableEntrySchema = new Schema({
    classId: Schema.Types.ObjectId,
    subject: String,
    weekhour: String
});

const teacherSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subjects: [String],
    timetable: [timetableEntrySchema]
});

module.exports = mongoose.model('Teacher', teacherSchema);