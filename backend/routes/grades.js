'use strict';

const Boom = require('boom');
const Student = require('../models/Student');

const getGrades = async function(request, h) {
    try {
        const id = request.params.studentId;
        const student = await Student.findOne({ _id: id });
        if(student === null)
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
        handler: getGrades
    }
];

module.exports = routes;