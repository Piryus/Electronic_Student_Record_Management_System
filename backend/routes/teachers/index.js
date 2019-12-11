'use strict';

const Valid = require('../../validation');
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
    {
        method: 'GET',
        path: '/meetings/availability',
        handler: async (request, h) => teachers.getMeetingsAvailability(request.auth.credentials.id),
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            }
        }
    },
    {
        method: 'POST',
        path: '/meetings/availability',
        handler: async (request, h) => teachers.setMeetingsAvailability(request.auth.credentials.id, request.payload.timeSlots),
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                payload: {
                    timeSlots: Valid.array.items(Valid.weekhour).required()
                }
            }
        }
    }
];

module.exports = routes;