'use strict';

const Boom = require('boom');
const Lecture = require('../models/Lecture');

const recordDailyLectureTopics = async function(request, h) {
    try {
        //
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const routes = [
    {
        method: 'POST',
        path: '/lectures',
        handler: recordDailyLectureTopics
    }
];

module.exports = routes;