'use strict';

const Boom = require('boom');

const Utils = require('../utils');
const Valid = require('../validation');

const Lecture = require('../models/Lecture');
const Teacher = require('../models/Teacher');

const getDailyLectureTopics = async function(request, h) {
    try {
        const { weekhour } = request.params;

        const datetime = Utils.weekhourToDate(weekhour);
        const teacher = await Teacher.findOne({ userId: request.auth.credentials.id });

        if(teacher === null || !teacher.timetable.some(t => t.weekhour === weekhour))
            return Boom.badRequest();

        const lecture = await Lecture.findOne({
            classId: teacher.timetable.find(t => t.weekhour === weekhour).classId,
            weekhour,
            date: datetime });

        return { topics: lecture ? lecture.topics : null };
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const recordDailyLectureTopics = async function(request, h) {
    try {
        const { weekhour, topics } = request.payload;

        const datetime = Utils.weekhourToDate(weekhour);
        const teacher = await Teacher.findOne({ userId: request.auth.credentials.id });

        if(teacher === null || !teacher.timetable.some(t => t.weekhour === weekhour) || datetime > new Date())
            return Boom.badRequest();

        await Lecture.findOneAndUpdate({ classId: teacher.timetable.find(t => t.weekhour === weekhour).classId, weekhour, date: datetime }, { topics }, { upsert: true });
        return { success: true };
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const routes = [
    {
        method: 'GET',
        path: '/lectures/{weekhour}',
        handler: getDailyLectureTopics,
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                params: {
                    weekhour: Valid.weekhour.required()
                }
            }
        }
    },
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
                    weekhour: Valid.weekhour.required(),
                    topics: Valid.longText.required()
                }
            }
        }
    }
];

module.exports = routes;