'use strict';

const admin = require('./admin');
const auth = require('./auth');
const lectures = require('./lectures');
const students = require('./students');
const officer = require('./officer');
const teacher = require('./teacher');

module.exports = [
    ...admin,
    ...auth,
    ...lectures,
    ...students,
    ...officer,
    ...teacher
];