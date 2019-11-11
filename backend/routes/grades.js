'use strict';

const Boom = require('boom');
const Student = require('../models/Student');
const Parent = require('../models/Parent');

const getGrades = async function(request, h) {
    try {
        const studentId = request.params.studentId;
        const parent = await parent.findOne({ userId: request.auth.credentials.id });
        const student = await Student.findOne({ _id: studentId });
        if(parent === null || student === null || !parent.children.includes(student._id))
            return Boom.badRequest();
        return { grades: student.grades };
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
            }
        }
    }
];

module.exports = routes;