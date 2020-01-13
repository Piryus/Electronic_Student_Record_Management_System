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
        path: '/timetable/{classId}',
        handler: async (request, h) => teachers.getTimetable(request.params.classId),
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                params: {
                    classId: Valid.id.required()
                }
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
        method: 'GET',
        path: '/meetings/{teacherId}/slots',
        handler: async (request, h) => teachers.getAvailableMeetingsSlots(request.auth.credentials.id, request.params.teacherId),
        options: {
            auth: {
                strategy: 'session',
                scope: 'parent'
            },
            validate: {
                params: {
                    teacherId: Valid.id.required()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/term/grades',
        handler: async (request, h) => teachers.getTermGrades(request.auth.credentials.id),
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
    },
    {
        method: 'POST',
        path: '/meetings/{teacherId}/book',
        handler: async (request, h) => teachers.bookMeetingSlot(request.auth.credentials.id, request.params.teacherId, request.payload.datetime),
        options: {
            auth: {
                strategy: 'session',
                scope: 'parent'
            },
            validate: {
                params: {
                    teacherId: Valid.id.required()
                },
                payload: {
                    datetime: Valid.date.required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/term/grades',
        handler: async (request, h) => teachers.publishTermGrades(request.auth.credentials.id, request.payload.grades),
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                payload: {
                    grades: Valid.array.items(Valid.studentGrades).required()
                }
            }
        }
    }
];

module.exports = routes;