'use strict';

const User = require('../models/User');

const login = async function (request, h) {
    try {
        const {mail, password} = request.payload;
        const user = await User.findOne({mail: mail});
        if (user === null || password !== user.password) {
            return {error: true};
        }
        request.cookieAuth.set({
            id: user._id
        });
        return {success: true};
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
            }
        }
    }
];

module.exports = routes;