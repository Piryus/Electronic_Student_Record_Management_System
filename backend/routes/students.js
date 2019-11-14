'use strict';

const Boom = require('boom');

const Valid = require('../validation');

const Parent = require('../models/Parent');
const SchoolClass = require ('../models/SchoolClass');
const Student = require('../models/Student');

const getGrades = async function(request, h) {
    try {
        const studentId = request.params.studentId;
        const parent = await Parent.findOne({ userId: request.auth.credentials.id });
        const student = await Student.findOne({ _id: studentId });
        if(parent === null || student === null || !parent.children.includes(student._id))
            return Boom.badRequest();
        return { grades: student.grades };
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const addStudent = async function(request, h) {
    try {
        const { ssn, name, surname } = request.payload;
        const newStudent = new Student({ ssn, name, surname });
        newStudent.save();
        return {success: true};
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const addSchoolClass = async function(request, h) {
    try {
        const { name, students } = request.payload;
        const schoolClass = await SchoolClass.findOneAndUpdate({ name: name.toUpperCase() }, {}, { upsert: true });
        await Student.updateMany({ classId: schoolClass._id }, { classId: undefined });
        await Student.updateMany({ _id: { $in: students } }, { classId: schoolClass._id });
        return { success: true };
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const routes = [
    {
        method: 'GET',
        path: '/grades/{studentId}',
        handler: getGrades,
        options: {
            auth: {
                strategy: 'session',
                scope: 'parent'
            },
            validate: {
                params: {
                    studentId: Valid.id.required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/students',
        handler: addStudent,
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            },
            validate: {
                payload: {
                    ssn: Valid.ssn.required(),
                    name: Valid.name.required(),
                    surname: Valid.name.required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/classes',
        handler: addSchoolClass,
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            },
            validate: {
                payload: {
                    name: Valid.className.required(),
                    students: Valid.array.items(Valid.id).required()
                }
            }
        }
    }
];

module.exports = routes;