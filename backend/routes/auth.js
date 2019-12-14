'use strict';

const Joi = require('@hapi/joi');
const Boom = require('boom');

const User = require('../models/User');
const Parent = require('../models/Parent');
const SchoolClass = require('../models/SchoolClass');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const login = async function (request, h) {
    try {
        const {mail, password} = request.payload;
        const user = await User.findOne({mail});
        if (user === null || password !== user.password) {
            return Boom.forbidden('Invalid mail/password.');
        } else {
            request.cookieAuth.set({
                id: user._id
            });
            // Case: user is a parent
            if (user.scope.includes('parent')) {
                // Retrieves the parent in the DB using the user ID
                const parent = await Parent.findOne({userId: user._id});
                // If the parent isn't found, it shouldn't happen, throw an error
                if (parent === null) {
                    return Boom.badRequest();
                }
                // Retrieves the parent's children using the parent's children's IDs
                const children = await Student.find({'_id': {$in: parent.children}});
                // For each children, keep only the necessary data and push those in an array
                let childrenFiltered = [];
                for (const childKey in children) {
                    let childFiltered = {
                        _id: children[childKey]._id,
                        ssn: children[childKey].ssn,
                        name: children[childKey].name,
                        surname: children[childKey].surname
                    };
                    childrenFiltered.push(childFiltered);
                }
                // Returns successful login, scope and parent's children
                return { success: true, scope: user.scope, extra: { children: childrenFiltered } };
            }
            // Case: user is a teacher
            if (user.scope.includes('teacher')) {
                // Retrieves the teacher in the DB using the user ID
                const teacher = await Teacher.findOne({userId: user._id});
                const schoolClass = await SchoolClass.findOne({ coordinator: teacher._id });
                // If the teacher isn't found, it shouldn't happen, throw an error
                if (teacher === null) {
                    return Boom.badRequest();
                }
                // Returns successful login, scope and teacher's timetable
                return {
                    success: true,
                    scope: user.scope,
                    extra: {
                        timetable: teacher.timetable,
                        coordinator: schoolClass ? { classId: schoolClass._id, name: schoolClass.name } : null
                    }
                };
            }
            // Returns successful login and scope (admin or teacher)
            return {success: true, scope: user.scope};
        }
    } catch (err) {
        return Boom.badImplementation(err);
    }
};

const logout = async function (request, h) {
    try {
        request.cookieAuth.clear();
        return true;
    } catch (e) {
        Boom.badImplementation(e);
    }
};

const authCheck = async function (request, h) {
    try {
        if (request.auth.isAuthenticated) {
            if (request.auth.credentials.scope.includes('parent')) {
                // Retrieves the parent in the DB using the user ID
                const parent = await Parent.findOne({userId: request.auth.credentials._id});
                // If the parent isn't found, it shouldn't happen, throw an error
                if (parent === null) {
                    return Boom.badRequest();
                }
                // Retrieves the parent's children using the parent's children's IDs
                const children = await Student.find({'_id': {$in: parent.children}});
                // For each children, keep only the necessary data and push those in an array
                let childrenFiltered = [];
                for (const childKey in children) {
                    let childFiltered = {
                        _id: children[childKey]._id,
                        ssn: children[childKey].ssn,
                        name: children[childKey].name,
                        surname: children[childKey].surname
                    };
                    childrenFiltered.push(childFiltered);
                }
                return {
                    isAuth: true,
                    role: request.auth.credentials.scope,
                    extra: {
                        children: childrenFiltered
                    }
                }
            } else if (request.auth.credentials.scope.includes('teacher')) {
                // Retrieves the parent in the DB using the user ID
                const teacher = await Teacher.findOne({userId: request.auth.credentials._id});
                const schoolClass = await SchoolClass.findOne({ coordinator: teacher._id });
                // If the parent isn't found, it shouldn't happen, throw an error
                if (teacher === null) {
                    return Boom.badRequest();
                }
                return {
                    isAuth: true,
                    role: request.auth.credentials.scope,
                    extra: {
                        timetable: teacher.timetable,
                        coordinator: schoolClass ? { classId: schoolClass._id, name: schoolClass.name } : null
                    }
                }
            } else {
                return {
                    isAuth: true,
                    role: request.auth.credentials.scope
                }
            }
        } else { // User is not authenticated
            return {
                isAuth: false
            }
        }
    } catch (e) {
        return Boom.badImplementation(e);
    }
};

const routes = [
    {
        method: 'POST',
        path: '/login',
        handler: login,
        options: {
            auth: {
                mode: 'try'
            },
            validate: {
                payload: {
                    mail: Joi.string().email().required(),
                    password: Joi.string().min(8).max(56).required()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/auth/check',
        handler: authCheck,
        options: {
            auth: {
                mode: 'optional'
            },
        }
    },
    {
        method: 'GET',
        path: '/logout',
        handler: logout,
        options: {
            auth: {
                mode: 'required',
                strategy: 'session'
            }
        }
    }
];

module.exports = routes;