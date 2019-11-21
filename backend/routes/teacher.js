'use strict';

const Boom = require('boom');
const Utils = require('../utils');
const Valid = require('../validation');
const Teacher = require('../models/Teacher');

const getTeacherSubjects = async function(request, h){
    try{
        const {id} = request.params;
        const teacher = await Teacher.findOne({_id: id});
        if(teacher === null){
            return Boom.badRequest();
        }
        return { subjects: teacher.subjects };
    } catch(err){
        return Boom.badImplementation(err);
    }
};

const routes = [
    {
        method: 'GET',
        path: '/subjects/{id}',
        handler: getTeacherSubjects,
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                params: {
                    id: Valid.id.required()
                }
             }
        },
    }
];

module.exports = routes;
