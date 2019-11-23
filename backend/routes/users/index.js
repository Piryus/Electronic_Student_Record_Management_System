'use strict';

const Valid = require('../../validation');
const Joi = require('@hapi/joi');
const handlers = require('./handlers');

const routes = [
    // Route to add a user into the database
    {
        method: 'POST',
        path: '/users/add',
        handler: async (request, h) => {
            const {mail, name, surname, ssn, scope} = request.payload;
            return handlers.addUser(mail, name, surname, ssn, scope);
        },
        options: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    mail: Valid.mail.required(),
                    name: Valid.name.required(),
                    surname: Valid.name.required(),
                    ssn: Valid.ssn.required(),
                    scope: Joi.any().valid('teacher', 'officer').required()
                }
            }
        }
    },
    // Route to get users in database
    {
        method: 'GET',
        path: '/users/all',
        handler: async (request, h) => handlers.getUsers(),
        options: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        }
    },
];

module.exports = routes;