'use strict';

const mongoose = require('mongoose');
const {Schema} = mongoose;

const parentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    children: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Parent', parentSchema);