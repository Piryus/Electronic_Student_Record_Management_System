'use strict';

const Boom = require('boom');

const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');

const getNotes = async function(teacherUId) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    const students = await Student.find();

    if(teacher === null)
        return Boom.badRequest();

    const notes = students.flatMap(s => s.notes.map(n => Object.assign({}, n, { studentId: s._id, student: [s.name, s.surname].join(' ')})))
                        .filter(n => n.teacherId.equals(teacher._id))
                        .sort((a, b) => b.date - a.date);

    return { notes };
};

module.exports = {
    getNotes
};