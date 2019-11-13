'use strict';

const Boom = require('boom');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Joi = require('@hapi/joi');


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

const addStudent = async function(request, h){
    try{
        const { ssn, name, surname } = request.payload;
        const newStudent = new Student({ ssn, name, surname });
        newStudent.save();
        return {success: true};
    } catch(err) {
        return Boom.badImplementation(err);
    }
}

const routes = [
    {
        method: 'GET',
        path: '/grades/{studentId}',
        handler: getGrades,
        options: {
            auth: {
                strategy: 'session',
                scope: 'parent'
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
                    ssn: Joi.string().required(),
                    name: Joi.string().required(),
                    surname: Joi.string().required()
                }
            }
        }
    }
];

module.exports = routes;