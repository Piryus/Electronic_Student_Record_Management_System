'use strict';

const grades = require('./grades');
const auth = require('./auth');

module.exports = [
    ...auth,
    ...grades
];