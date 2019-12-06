'use strict';

const admin = require('./admin');
const auth = require('./auth');
const files = require('./files');
const lectures = require('./lectures');
const students = require('./students');
const secretary = require('./secretary');
const teachers = require('./teachers');
const users = require('./users');

module.exports = [
    ...admin,
    ...auth,
    ...files,
    ...lectures,
    ...students,
    ...secretary,
    ...teachers,
    ...users
];