'use strict';

const Valid = require('../../validation');
const lectures = require('./handlers');

const routes = [
    {
        method: 'GET',
        path: '/lectures/{weekhour}',
        handler: async (request, h) => lectures.getDailyLectureTopics(request.auth.credentials.id, request.params.weekhour),
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                params: {
                    weekhour: Valid.weekhour.required()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/assignments/{studentId}',
        handler: async (request, h) => lectures.getAssignments(request.auth.credentials.id, request.params.studentId),
        options: {
            auth: {
                strategy: 'session',
                scope: 'parent'
            },
            validate: {
                params: {
                    studentId: Valid.id.required()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/attendance',
        handler: async (request, h) => lectures.getAttendance(request.auth.credentials.id),
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            }
        }
    },
    {
        method: 'POST',
        path: '/lectures',
        handler: async (request, h) => {
            const { weekhour, topics } = request.payload;
            return lectures.recordDailyLectureTopics(request.auth.credentials.id, weekhour, topics);
        },
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                payload: {
                    weekhour: Valid.weekhour.required(),
                    topics: Valid.longText.required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/assignments',
        handler: async (request, h) => {
            const { subject, description, due } = request.payload;
            return lectures.recordAssignments(request.auth.credentials.id, subject, description, due);
        },
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                payload: {
                    subject: Valid.subject.required(),
                    description: Valid.longText.required(),
                    due: Valid.date.required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/rollcall',
        handler: async (request, h) => lectures.rollCall(request.auth.credentials.id, request.payload.rollCall),
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                payload: {
                    info: Valid.rollCall
                }
            }
        }
    },
];

module.exports = routes;