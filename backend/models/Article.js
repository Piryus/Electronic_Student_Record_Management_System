'use strict';

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    authorId: mongoose.Types.ObjectId,
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Article', articleSchema);