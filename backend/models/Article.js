'use strict';

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: mongoose.Types.ObjectId,
    date: Date,
});

module.exports = mongoose.model('Article', articleSchema);