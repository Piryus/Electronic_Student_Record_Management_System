'use strict';

const mongoose = require('mongoose');
require('../models/User');

const User = mongoose.model('users');

const routes = [
    {
        method: 'POST',
        path: '/login',
        handler: async (request, h) => {
            const {username, password} = request.payload;
            return new Promise((resolve, reject) => {
                User.findOne({username: username})
                    .then((account) => {
                        if (!account || password !== account.password) {
                            resolve('Wrong username/password.');
                        } else {
                            request.cookieAuth.set({id: account.id});
                            resolve('Success!');
                        }
                    });
            });
        },
        options: {
            auth: {
                mode: 'try'
            }
        }
    }
];

module.exports = routes;