'use strict';

const parents = require('./handlers');

const routes = [
    {
        method: 'GET',
        path: '/children',
        handler: async (request, h) => parents.getChildren(request.auth.credentials.id),
        options: {
            auth: {
                strategy: 'session',
                scope: 'parent'
            }
        }
    }
];

module.exports = routes;