'use strict';

const Joi = require('@hapi/joi');

const User = require('../models/User');

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
            return {success: true};
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
            const userRole = request.auth.credentials.scope;
            return {
                isAuth: true,
                role: userRole
            };
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