'use strict';

const Boom = require('boom');
const HLib = require('@emarkk/hlib');

const SchoolClass = require('../../models/SchoolClass');
const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');

const getNotes = async function(teacherUId) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    const students = await Student.find();

    if(teacher === null)
        return Boom.badRequest();

    const notes = students.flatMap(s => s.notes.map(n => Object.assign({
        teacherId: n.teacherId,
        description: n.description,
        date: n.date
    }, { studentId: s._id, student: [s.name, s.surname].join(' ')}))).filter(n => n.teacherId.equals(teacher._id)).sort((a, b) => b.date - a.date);

    return { notes };
};

const getMeetingsAvailability = async function(teacherUId) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    
    if(teacher === null)
        return Boom.badRequest();

    return { timeSlots: teacher.meetingsTimeSlots };
};

const getTermGrades = async function(teacherUId) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    
    if(teacher === null)
        return Boom.badRequest();

    const schoolClass = await SchoolClass.findOne({ coordinator: teacher._id });
    
    if(schoolClass === null)
        return Boom.badRequest();
        
    const endedTerms = schoolClass.termsEndings.length;
    const students = await Student.find({ classId: schoolClass._id });
    
    let result = {
        assigned: [0, 1].map(i => endedTerms > i),
        termGrades: [0, 1].map(i => {
            return endedTerms > i ? students.map(s => {
                return {
                    studentId: s._id,
                    surname: s.surname,
                    name: s.name,
                    grades: s.termGrades[i]
                };
            }) : null;
        }),
        gradesSuggestions: [0, 1].map(i => {
            return endedTerms === i ? students.map(s => {
                return {
                    studentId: s._id,
                    surname: s.surname,
                    name: s.name,
                    grades: HLib.getGradesAverages(s.grades.filter(g => i === 0 || g.date > schoolClass.termsEndings[0]))
                };
            }) : null;
        })
    };

    return result;
};

const setMeetingsAvailability = async function(teacherUId, timeSlots) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    
    if(teacher === null || teacher.timetable.some(t => timeSlots.includes(t.weekhour)))
        return Boom.badRequest();

    teacher.meetingsTimeSlots = timeSlots;
    await teacher.save();

    return { success: true };
};

const publishTermGrades = async function(teacherUId, gradesInfo) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    
    if(teacher === null)
        return Boom.badRequest();

    const schoolClass = await SchoolClass.findOne({ coordinator: teacher._id });
    
    if(schoolClass === null || schoolClass.termsEndings.length === 2)
        return Boom.badRequest();

    let students = await Student.find({ classId: schoolClass._id });

    if(students.length !== gradesInfo.length || students.map(s => s._id.toString).some(s => !gradesInfo.map(g => g.studentId).includes(s)))
        return Boom.badRequest();

    students = students.map(s => {
        s.termGrades.push(gradesInfo.find(g => s._id.equals(g.studentId)).grades);
        return s;
    });

    schoolClass.termsEndings.push(new Date());
    await schoolClass.save();
    
    await Promise.all(students.map(s => s.save()));
            
    return { success: true };
};

module.exports = {
    getNotes,
    getMeetingsAvailability,
    getTermGrades,
    setMeetingsAvailability,
    publishTermGrades
};