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
];

module.exports = routes;