'use strict';

const Boom = require('boom');
const HLib = require('@emarkk/hlib');

const Parent = require('../../models/Parent');
const SchoolClass = require ('../../models/SchoolClass');
const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');

const getGrades = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId }, { 'grades._id': 0 });

    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();

    return { grades: student.grades };
};

const getAttendance = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId }, { 'attendanceEvents._id': 0 });

    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();

    return { attendance: student.attendanceEvents };
};

const getNotes = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId });

    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();

    return { notes: student.notes };
};

const getStudents = async function(classId) {
    const filter = classId !== null ? { classId } : {};
    const students = await Student.find(filter, { 'grades._id': 0 });
    return { students };
};

const getClasses = async function() {
    const classes = await SchoolClass.find({});
    return { classes };
};

const recordGrades = async function(teacherUId, subject, grades) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    const students = await Student.find({ _id: { $in: grades.map(g => g.studentId) }});
    const schoolClassesIds = students.reduce((arr, x) => {
        if(!arr.some(i => i.equals(x.classId))) arr.push(x.classId);
        return arr;
    }, []);

    if(teacher === null || students.length != grades.length || schoolClassesIds.length !== 1)
        return Boom.badRequest();

    if(!teacher.timetable.some(t => (t.classId.equals(schoolClassesIds[0]) && t.subject === subject && HLib.weekhourToDate(t.weekhour) < Date.now())))
        return Boom.badRequest();

    students.forEach(s => s.grades.push({ value: grades.find(g => g.studentId === s._id.toString()).grade, subject }));
    await Promise.all(students.map(s => s.save()));

    return {success: true};
};

const recordAttendance = async function(teacherUId, classId, info) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    const students = await Student.find({ _id: { $in: info.map(i => i.studentId) }});

    if(teacher === null || students.length != info.length || !students.every(s => s.classId.toString() === classId))
        return Boom.badRequest();

    const whs = teacher.timetable.filter(t => t.classId.toString() === classId && HLib.weekhourToDate(t.weekhour).isSameDayOf(new Date(Date.now()))).map(t => t.weekhour);

    if(whs.length === 0 || info.some(i => i.time !== null && (!i.time.isTimeIncludedInWeekhours(whs) || !i.time.isTimeValidFor(i.attendanceEvent))))
        return Boom.badRequest();

    students.forEach(s => {
        let sInfo = info.find(i => i.studentId === s._id.toString());
        s.attendanceEvents = s.attendanceEvents.filter(ae => ae.event !== sInfo.attendanceEvent || !ae.date.isSameDayOf(new Date(Date.now())));
        if(sInfo.time !== null)
            s.attendanceEvents.push({ date: HLib.timeToDate(sInfo.time), event: sInfo.attendanceEvent });
    });
    await Promise.all(students.map(s => s.save()));

    return { success: true };
};

const recordNote = async function(teacherUId, studentId, description) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    const student = await Student.findById(studentId);

    if(teacher === null || student === null)
        return Boom.badRequest();

    student.notes.push({
        teacherId: teacher._id,
        description
    });
    await student.save();

    return { success: true };
};

const addStudent = async function(ssn, name, surname) {
    const newStudent = new Student({ ssn, name, surname });
    await newStudent.save();

    return {success: true};
};

const addSchoolClass = async function(name, students) {
    const schoolClass = await SchoolClass.findOneAndUpdate({ name: name.toUpperCase() }, {}, { new: true, upsert: true });
    await Student.updateMany({ classId: schoolClass._id }, { classId: undefined });
    await Student.updateMany({ _id: { $in: students } }, { classId: schoolClass._id });

    return { success: true };
};

module.exports = {
    getGrades,
    getAttendance,
    getNotes,
    getStudents,
    getClasses,
    recordGrades,
    recordAttendance,
    recordNote,
    addStudent,
    addSchoolClass
};