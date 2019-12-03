'use strict';

const isAdmin = async function (request, h) {
    return true;
};

const routes = [
    // Basic route to test whether the logged in user is an admin
    {
        method: 'GET',
        path: '/admin/status/',
        handler: isAdmin,
        options: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        }
    },
];

module.exports = routes;