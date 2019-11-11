'use strict';

const Boom = require('boom');

const Utils = require('../utils');
const Valid = require('../validation');

const Lecture = require('../models/Lecture');
const Teacher = require('../models/Teacher');

const recordDailyLectureTopics = async function(request, h) {
    try {
        const { classId, datetime, topics } = request.payload;

        datetime.setMinutes(0, 0, 0);
        const weekhour = Utils.dateToWeekhour(datetime);
        const teacher = await Teacher.findOne({ userId: request.auth.credentials.id });

        if(teacher === null || weekhour === null)
            return Boom.badRequest();

        // a teacher cannot register lecture topics neither before the start of the lecture nor
        // after the end of the week
        const now = new Date();
        const weekstart = now.weekStart();
        if(datetime > now || datetime < weekstart)
            return Boom.badRequest();

        // check teacher has lecture in that hour in that class
        if(!teacher.timetable.some(t => t.weekhour === weekhour && t.classId === classId))
            return Boom.badRequest();

        await Lecture.findOneAndUpdate({ classId, weekhour, datetime }, { topics }, { upsert: true });
        return { success: true };
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const routes = [
    {
        method: 'POST',
        path: '/lectures',
        handler: recordDailyLectureTopics,
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                payload: {
                    classId: Valid.id,
                    datetime: Valid.date,
                    topics: Valid.longText
                }
            }
        }
    }
];

module.exports = routes;