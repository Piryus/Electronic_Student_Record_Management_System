'use strict';

const files = require('./handlers');

const routes = [
    {
        method: 'GET',
        path: '/file/{fileId}',
        handler: async (request, h) => files.get(request.auth.credentials.id, request.params.fileId),
        options: {
            auth: {
                strategy: 'session',
                scope: 'parent'
            },
            validate: {
                params: {
                    fileId: Valid.id.required()
                }
            }
        }
    },
];

module.exports = routes;