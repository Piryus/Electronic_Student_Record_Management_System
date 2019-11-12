'use strict';

const Boom = require('boom');
const Student = require('../models/Student');
const Parent = require('../models/Parent');

const getChildren = async function (request, h) {
    try {
        const parent = await Parent.findOne({userId: request.auth.credentials.id});
        if (parent === null) {
            return Boom.badRequest();
        }
        const childrenIds = parent.children;
        return await Student.find({'_id': { $in: childrenIds}});
    } catch (e) {
        return Boom.badImplementation(e);
    }
};

const routes = [{
    method: 'GET',
    path: '/parent/children',
    handler: getChildren,
    options: {
        auth: {
            strategy: 'session',
            scope: 'parent'
        }
    }
}];

module.exports = routes;