'use strict';

const Boom = require('boom');

const Utils = require('../../utils');

const Lecture = require('../../models/Lecture');
const SchoolClass = require('../../models/SchoolClass');
const Teacher = require('../../models/Teacher');

const getDailyLectureTopics = async function(teacherUId, weekhour) {
    const datetime = Utils.weekhourToDate(weekhour);
    const teacher = await Teacher.findOne({ userId: teacherUId });

    if(teacher === null || !teacher.timetable.some(t => t.weekhour === weekhour))
        return Boom.badRequest();

    const lecture = await Lecture.findOne({
        classId: teacher.timetable.find(t => t.weekhour === weekhour).classId,
        weekhour,
        date: datetime });

    return { topics: lecture ? lecture.topics : null };
};

const recordDailyLectureTopics = async function(teacherUId, weekhour, topics) {
    const datetime = Utils.weekhourToDate(weekhour);
    const teacher = await Teacher.findOne({ userId: teacherUId });

    if(teacher === null || !teacher.timetable.some(t => t.weekhour === weekhour) || datetime > Date.now())
        return Boom.badRequest();

    await Lecture.findOneAndUpdate({ classId: teacher.timetable.find(t => t.weekhour === weekhour).classId, weekhour, date: datetime }, { topics }, { upsert: true });
    return { success: true };
};

const getAssignments = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId });
    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();
    const schoolClass = await SchoolClass.findOne({ _id: student.classId });
    const assignments = schoolClass.assignments.filter(a => a.due >= new Date().dayStart());
    return { assignments };
};

module.exports = {
    getDailyLectureTopics,
    recordDailyLectureTopics,
    getAssignments
};