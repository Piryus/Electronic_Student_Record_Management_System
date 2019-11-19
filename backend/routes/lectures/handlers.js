'use strict';

const Boom = require('boom');

const Utils = require('../utils');

const Lecture = require('../models/Lecture');
const Teacher = require('../models/Teacher');

const getDailyLectureTopics = async function(teacherUId, weekhour) {
    try {
        const datetime = Utils.weekhourToDate(weekhour);
        const teacher = await Teacher.findOne({ userId: teacherUId });

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

const recordDailyLectureTopics = async function(teacherUId, weekhour, topics) {
    try {
        const datetime = Utils.weekhourToDate(weekhour);
        const teacher = await Teacher.findOne({ userId: teacherUId });

        if(teacher === null || !teacher.timetable.some(t => t.weekhour === weekhour) || datetime > new Date())
            return Boom.badRequest();

        await Lecture.findOneAndUpdate({ classId: teacher.timetable.find(t => t.weekhour === weekhour).classId, weekhour, date: datetime }, { topics }, { upsert: true });
        return { success: true };
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

module.exports = {
    getDailyLectureTopics,
    recordDailyLectureTopics
};