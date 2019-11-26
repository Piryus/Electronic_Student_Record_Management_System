'use strict';

const Boom = require('boom');
const HLib = require('hlib');

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

const recordAttendance = async function(teacherUId, attendanceInfo) {
    const now = HLib.dateToWeekhour(new Date(Date.now()));
    const teacher = await Teacher.findOne({ userId: teacherUId });
    const students = await Student.find({ _id: { $in: attendanceInfo.map(a => a.studentId) }});
    const schoolClassesIds = students.reduce((arr, x) => {
        if(!arr.some(i => i.equals(x.classId))) arr.push(x.classId);
        return arr;
    }, []);
    
    if(teacher === null || now === null || students.length != attendanceInfo.length || schoolClassesIds.length !== 1 ||
        !teacher.timetable.some(t => t.classId.equals(schoolClassesIds[0]) && t.weekhour === now))
        return Boom.badRequest();

    const absentees = attendanceInfo.filter(a => a.attendanceEvent === 'absent');

    if(absentees.length && now.split('_')[1] !== 0)
        return Boom.badRequest();

    students.filter(s => attendanceInfo.map(a => a.studentId).includes(s._id)).forEach(s => 
        s.attendanceEvents.push({ event: 'absence' })
    );
    await Promise.all(students.map(s => s.save()));

    return {success: true};
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
    getStudents,
    getClasses,
    recordGrades,
    recordAttendance,
    addStudent,
    addSchoolClass
};