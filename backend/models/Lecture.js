'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const lectureSchema = new Schema({
    classId: mongoose.Types.ObjectId,
    weekhourId: String,
    topics: String
});

module.exports = mongoose.model('Lecture', lectureSchema);