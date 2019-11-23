'use strict';

const Valid = require('../../validation');
const students = require('./handlers');

const routes = [
    {
        method: 'GET',
        path: '/grades/{studentId}',
        handler: async (request, h) => students.getGrades(request.auth.credentials.id, request.params.studentId),
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
        path: '/attendance/{studentId}',
        handler: async (request, h) => students.getAttendance(request.auth.credentials.id, request.params.studentId),
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
        path: '/students/all',
        handler: async (request, h) => students.getAllStudents(),
        options: {
            auth: {
                strategy: 'session',
                scope: ['officer', 'teacher']
            }
        }
    },
    {
        method: 'GET',
        path: '/classes/all',
        handler: async (request, h) => students.getAllClasses(),
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            }
        }
    },
    {
        method: 'POST',
        path: '/students',
        handler: async (request, h) => {
            const { ssn, name, surname } = request.payload;
            return students.addStudent(ssn, name, surname);
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
                    surname: Valid.name.required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/classes',
        handler: async (request, h) => { //Don't use same name "students" both for imported students.js and for parameter in payload. It will cause an error. (FIXED)
            const { name, studentIds } = request.payload;
            return students.addSchoolClass(name, studentIds);
        },
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            },
            validate: {
                payload: {
                    name: Valid.className.required(),
                    studentIds: Valid.array.items(Valid.id).required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/grades/{studentId}',
        handler: async (request, h) => {
            const { subject, grade } = request.payload;
            return students.addGrade(request.auth.credentials.id, request.params.studentId, subject, grade);
        },
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                params: {
                    studentId: Valid.id.required()
                },
                payload: {
                    subject: Valid.subject.required(),
                    grade: Valid.grade.required() 
                }
            }
        }
    },
];

module.exports = routes;