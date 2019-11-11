'use strict';

const Joi = require('@hapi/joi');

const User = require('../models/User');

const login = async function (request, h) {
    try {
        const { mail, password } = request.payload;
        const user = await User.findOne({ mail });
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
    }
];

module.exports = routes;