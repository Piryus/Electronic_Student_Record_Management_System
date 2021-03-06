'use strict';

const Valid = require('../../validation');
const students = require('./handlers');

const routes = [
    {
        method: 'GET',
        path: '/teachers/{studentId}',
        handler: async (request, h) => students.getTeachers(request.auth.credentials.id, request.params.studentId),
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
        path: '/grades/{studentId}/term',
        handler: async (request, h) => students.getTermGrades(request.auth.credentials.id, request.params.studentId),
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
        path: '/notes/{studentId}',
        handler: async (request, h) => students.getNotes(request.auth.credentials.id, request.params.studentId),
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
        path: '/students',
        handler: async (request, h) => students.getStudents(request.query.classId || null),
        options: {
            auth: {
                strategy: 'session',
                scope: ['officer', 'teacher']
            },
            validate: {
                query: {
                    classId: Valid.id
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/classes',
        handler: async (request, h) => students.getClasses(),
        options: {
            auth: {
                strategy: 'session',
                scope: ['officer', 'teacher']
            }
        }
    },
    {
        method: 'POST',
        path: '/grades',
        handler: async (request, h) => {
            const { subject, date, description, grades } = request.payload;
            return students.recordGrades(request.auth.credentials.id, subject, date, description, grades);
        },
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                payload: {
                    subject: Valid.subject.required(),
                    date: Valid.date.required(),
                    description: Valid.shortText.required(),
                    grades: Valid.array.items(Valid.gradeInfo).required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/attendance',
        handler: async (request, h) => students.recordAttendance(request.auth.credentials.id, request.payload.classId, request.payload.info),
        options: {
            auth: {
                strategy: 'session',
                scope: 'teacher'
            },
            validate: {
                payload: {
                    classId: Valid.id.required(),
                    info: Valid.array.items(Valid.attendanceInfo).required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/notes/{studentId}',
        handler: async (request, h) => students.recordNote(request.auth.credentials.id, request.params.studentId, request.payload.description),
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
                    description: Valid.longText.required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/students',
        handler: async (request, h) => {
            const {ssn,
                name,
                surname,
                parentOneName,
                parentOneSurname,
                parentOneSsn,
                parentOneEmail,
                parentTwoName,
                parentTwoSurname,
                parentTwoSsn,
                parentTwoEmail} = request.payload;
            return students.addStudent(ssn,
                name,
                surname,
                parentOneName,
                parentOneSurname,
                parentOneSsn,
                parentOneEmail,
                parentTwoName,
                parentTwoSurname,
                parentTwoSsn,
                parentTwoEmail);
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
                    parentOneName: Valid.name.required(),
                    parentOneSurname: Valid.name.required(),
                    parentOneSsn: Valid.ssn.required(),
                    parentOneEmail: Valid.mail.required(),
                    parentTwoName: Valid.name.optional(),
                    parentTwoSurname: Valid.name.optional(),
                    parentTwoSsn: Valid.ssn.optional(),
                    parentTwoEmail: Valid.mail.optional()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/classes',
        handler: async (request, h) => { //Don't use same name "students" both for imported students.js and for parameter in payload. It will cause an error. (FIXED)
            const {name, studentIds} = request.payload;
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
    }
];

module.exports = routes;