'use strict';

const Valid = require('../../validation');
const secretary = require('./handlers');

const routes = [
    {
        method: 'GET',
        path: '/teachers',
        handler: async (request, h) => secretary.getTeachers(),
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            }
        }
    },
    {
        method: 'GET',
        path: '/articles',
        handler: async (request, h) => secretary.getArticles(),
        options: {
            auth: {
                strategy: 'session',
                scope: ['officer', 'parent']
            }
        }
    },
    {
        method: 'POST',
        path: '/articles',
        handler: async (request, h) => {
            const {title, content} = request.payload;
            return secretary.addArticle(request.auth.credentials.id, title, content);
        },
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            },
            validate: {
                payload: {
                    title: Valid.articleTitle.required(),
                    content: Valid.articleContent.required()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/parents',
        handler: async (request, h) => secretary.getParents(),
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            }
        }
    },
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
    {
        method: 'POST',
        path: '/parents',
        handler: async (request, h) => {
            const {parents} = request.payload;
            return secretary.sendCredentials(parents);
        },
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            },
            validate: {
                payload: {
                    parents: Valid.array.items(Valid.id).required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/timetables',
        handler: async (request, h) => secretary.publishTimetables(request.payload.timetablesFile),
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            },
            validate: {
                payload: {
                    timetablesFile: Valid.any.required()
                }
            },
            payload: {
                maxBytes: 10485760,
                output: 'file',
                parse: true
            }
        }
    }
];

module.exports = routes;