'use strict';

const Joi = require('@hapi/joi');

const User = require('../models/User');

const isAdmin = async function (request, h) {
    return true;
};

const addUser = async function (request, h) {
    try {
        const { mail, password, scope } = request.payload;
        const user = await User.findOne({mail: mail});
        if(user === null) {
            const newUser = new User({ mail, password, scope });
            await newUser.save();
            return {success: true};
        } else {
            return Boom.badRequest('The user already exists.');
        }
    } catch (err) {
        return Boom.badImplementation(err);
    }
};

const routes = [
    // Basic route to test whether the logged in user is an admin
    {
        method: 'GET',
        path: '/admin/status/',
        handler: isAdmin,
        options: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        }
    },
    // Route to add a user into the database
    {
        method: 'POST',
        path: '/admin/users/new',
        handler: addUser,
        options: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    mail: Joi.string().email().required(),
                    password: Joi.string().min(8).max(56).required(),
                    scope: Joi.string().required()
                }
            }
        }
    },
    // Route to add a parent into the database
];

module.exports = routes;