'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const holidaySchema = new Schema({
    start: Date,
    end: Date
});

const calendarSchema = new Schema({
    academicYear: String,
    firstDay: Date,
    lastDay: Date,
    holidays: [holidaySchema]
});

module.exports = mongoose.model('Calendar', calendarSchema);