'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const lectureSchema = new Schema({
    classId: ObjectId,
    weekhourId: String,
    topics: String
});

module.exports = mongoose.model('Lecture', lectureSchema);