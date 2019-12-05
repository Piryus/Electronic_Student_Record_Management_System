'use strict';

const teachers = require('./handlers');

const routes = [
    {
        method: 'GET',
        path: '/notes',
        handler: async (request, h) => teachers.getNotes(request.auth.credentials.id),
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            }
        }
    },
];

module.exports = routes;