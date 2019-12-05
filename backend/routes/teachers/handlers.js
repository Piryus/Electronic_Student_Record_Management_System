'use strict';

const Boom = require('boom');

const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');

const getNotes = async function(teacherUId) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    const students = await Student.find();

    if(teacher === null)
        return Boom.badRequest();

    return { notes: students.flatMap(s => s.notes).filter(n => n.teacherId.equals(teacher._id)).sort((a, b) => b.date - a.date) };
};

module.exports = {
    getNotes
};