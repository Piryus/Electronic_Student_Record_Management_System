'use strict';

const admin = require('./admin');
const auth = require('./auth');
const lectures = require('./lectures');
const students = require('./students');
const secretary = require('./secretary');

module.exports = [
    ...admin,
    ...auth,
    ...lectures,
    ...students,
    ...secretary
];