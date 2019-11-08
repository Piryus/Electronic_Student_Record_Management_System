'use strict';

const auth = require('./auth');
const grades = require('./grades');
const lectures = require('./lectures');
const admin = require('./admin');

module.exports = [
    ...auth,
    ...grades,
    ...lectures,
    ...admin,
];