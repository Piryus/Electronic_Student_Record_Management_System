'use strict';

const admin = require('./admin');
const auth = require('./auth');
const lectures = require('./lectures');
const students = require('./students');
const secretary = require('./secretary');
const articles = require('./articles');
const users = require('./users');

module.exports = [
    ...admin,
    ...auth,
    ...lectures,
    ...students,
    ...articles,
    ...secretary,
    ...users
];