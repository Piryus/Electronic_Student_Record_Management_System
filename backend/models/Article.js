'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Article', articleSchema);