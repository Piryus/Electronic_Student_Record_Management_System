'use strict';

const auth = require('./auth');
const grades = require('./grades');
const lectures = require('./lectures');

module.exports = [
    ...auth,
    ...grades,
    ...lectures
];