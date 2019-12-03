'use strict';

const Joi = require('@hapi/joi');

const Valid = require('../../validation');

const users = require('./handlers');

const routes = [
    {
        method: 'GET',
        path: '/users',
        handler: async (request, h) => users.getUsers(),
        options: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        }
    },
    {
        method: 'POST',
        path: '/users',
        handler: async (request, h) => {
            const {mail, name, surname, ssn, scope} = request.payload;
            return users.addUser(mail, name, surname, ssn, scope);
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
    {
        method: 'PATCH',
        path: '/users/{userId}',
        handler: async (request, h) => {
            const {mail, name, surname, ssn, scope} = request.payload;
            return users.updateUser(request.params.userId, mail, name, surname, ssn, scope);
        },
        options: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    userId: Valid.id.required()
                },
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
    {
        method: 'DELETE',
        path: '/users/{userId}',
        handler: async (request, h) => users.deleteUser(request.params.userId),
        options: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    userId: Valid.id.required()
                }
            }
        }
    }
];

module.exports = routes;