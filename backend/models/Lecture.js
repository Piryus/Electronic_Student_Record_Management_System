'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const lectureSchema = new Schema({
    classId: Schema.Types.ObjectId,
    weekhour: String,
    date: Date,
    topics: String
});

module.exports = mongoose.model('Lecture', lectureSchema);