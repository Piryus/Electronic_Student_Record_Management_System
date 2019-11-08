'use strict';

const User = require('../models/User');

const isAdmin = async function(request, h) {
    return true;
};

const addUser = async function(request, h) {
    try {
        const {mail, password, scope, children} = request.payload;
        const user = await User.findOne({ mail: mail });
        if (user === null) {
            const newUser = new User({mail: mail, password: password, scope: scope, children: children});
            newUser.save(function (err, user) {
                if (err) return console.error(err);
                console.log(user.name + " added to the database.");
            });
            return { success: true };
        } else {
            return { error: true };
        }
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const routes = [
    // Basic route to test whether the logged in user is an admin
    {
        method: 'GET',
        path: '/admin/status/',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            } ,
            handler: isAdmin
        }
    },
    // Route to add a user into the database
    {
        method: 'POST',
        path: '/admin/users/new',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            handler: addUser
        }
    }
];

module.exports = routes;