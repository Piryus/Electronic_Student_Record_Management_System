'use strict';

const Boom = require('boom');
const HLib = require('@emarkk/hlib');

const Util = require('../../utils');

const Lecture = require('../../models/Lecture');
const SchoolClass = require('../../models/SchoolClass');
const Parent = require('../../models/Parent');
const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');

const getDailyLectureTopics = async function(teacherUId, weekhour) {
    const datetime = HLib.weekhourToDate(weekhour);
    const teacher = await Teacher.findOne({ userId: teacherUId });

    if(teacher === null || !teacher.timetable.some(t => t.weekhour === weekhour))
        return Boom.badRequest();

    const lecture = await Lecture.findOne({
        classId: teacher.timetable.find(t => t.weekhour === weekhour).classId,
        weekhour,
        date: datetime });

    return { topics: lecture ? lecture.topics : null };
};

const getAssignments = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId });
    
    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();

    const schoolClass = await SchoolClass.findOne({ _id: student.classId }, { 'assignments._id': 0 }).populate('assignments.attachments');
    const assignments = schoolClass.assignments.filter(a => a.due >= new Date(Date.now()).dayStart());
    return { assignments };
};

const getAttendance = async function(teacherUId) {
    const nd = new Date(Date.now()).getNormalizedDay();
    const teacher = await Teacher.findOne({ userId: teacherUId });

    if(teacher === null)
        return Boom.badRequest();

    const classes = teacher.timetable.filter(t => t.weekhour.startsWith(nd + '_')).map(t => t.classId);

    if(classes.length === 0)
        return Boom.badRequest();

    const students = await Student.find({ classId: { $in: classes } }, { 'attendanceEvents._id': 0 });
    const attendance = students.reduce((acc, i) => {
        let cId = i.classId.toString();
        let data = { id: i._id, events: i.attendanceEvents.filter(ae => ae.date.isSameDayOf(new Date(Date.now()))) };
        if(acc[cId] === undefined)
            acc[cId] = [data];
        else if(!acc[cId].some(s => s.id.equals(i._id)))
            acc[cId].push(data);
        return acc;
    }, {});

    return { attendance };
};

const recordDailyLectureTopics = async function(teacherUId, weekhour, topics) {
    const datetime = HLib.weekhourToDate(weekhour);
    const teacher = await Teacher.findOne({ userId: teacherUId });

    if(teacher === null || !teacher.timetable.some(t => t.weekhour === weekhour) || datetime > Date.now())
        return Boom.badRequest();

    await Lecture.findOneAndUpdate({ classId: teacher.timetable.find(t => t.weekhour === weekhour).classId, weekhour, date: datetime }, { topics }, { upsert: true });
    
    return { success: true };
};

const recordAssignments = async function(teacherUId, subject, description, due, files) {
    const weekhour = HLib.dateToWeekhour(due);
    const teacher = await Teacher.findOne({ userId: teacherUId });

    if(teacher === null || weekhour === null || !teacher.timetable.some(t => (t.weekhour === weekhour && t.subject === subject)) || due < new Date(Date.now()).addDays(1).dayStart())
        return Boom.badRequest();

    const attachments = await Util.saveFiles(Array.isArray(files) ? files : [files]);

    const schoolClass = await SchoolClass.findOne({ _id: teacher.timetable.find(t => t.weekhour === weekhour).classId });
    schoolClass.assignments.push({ subject, description, due, attachments });
    await schoolClass.save();

    return { success: true };
};

const addSupportMaterial = async function(teacherUId, classId, subject, description, files) {
    const teacher = await Teacher.findOne({ userId: teacherUId });

    if(teacher === null || !teacher.timetable.some(t => t.classId.toString() === classId && t.subject === subject))
        return Boom.badRequest();
    
    const attachments = await Util.saveFiles(Array.isArray(files) ? files : [files]);

    const schoolClass = await SchoolClass.findOne({ _id: classId });
    schoolClass.supportMaterials.push({ subject, description, attachments });
    await schoolClass.save();

    return { success: true };
};

const rollCall = async function(teacherUId, info) {
    const nd = new Date(Date.now()).getNormalizedDay();
    const teacher = await Teacher.findOne({ userId: teacherUId });

    if(teacher === null)
        return Boom.badRequest();

    const classId = (teacher.timetable.find(t => t.weekhour === nd + '_0') || {}).classId;

    if(classId === undefined)
        return Boom.badRequest();

    const students = await Student.find({ classId });

    if(students.length !== info.length || !students.map(s => s._id.toString()).every(s => info.map(i => i.studentId).includes(s)))
        return Boom.badRequest();

    students.forEach(s => {
        if(info.find(i => i.studentId === s._id.toString()).present)
            s.attendanceEvents = s.attendanceEvents.filter(ae => ae.event !== 'absence' || !ae.date.isSameDayOf(new Date(Date.now())));
        else if(!s.attendanceEvents.some(ae => ae.event === 'absence' && ae.date.isSameDayOf(new Date(Date.now()))))
            s.attendanceEvents.push({ date: HLib.weekhourToDate(nd + '_0'), event: 'absence' });
    });
    await Promise.all(students.map(s => s.save()));

    return { success: true };
};

module.exports = {
    getDailyLectureTopics,
    getAssignments,
    getAttendance,
    recordDailyLectureTopics,
    recordAssignments,
    addSupportMaterial,
    rollCall
};