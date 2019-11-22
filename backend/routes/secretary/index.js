'use strict';

const Valid = require('../../validation');
const secretary = require('./handlers');

const routes = [
    {
        method: 'POST',
        path: '/parent',
        handler: async (request, h) => {
            const { ssn, name, surname, mail, childSsn } = request.payload;
            return secretary.addParent(ssn, name, surname, mail, childSsn);
        },
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            },
            validate: {
                payload: {
                    ssn: Valid.ssn.required(),
                    name: Valid.name.required(),
                    surname: Valid.name.required(),
                    mail: Valid.mail.required(),
                    childSsn: Valid.ssn.required()
                }
            }
        }
    },
];

module.exports = routes;