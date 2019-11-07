'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const routes = require('./routes');
require('./models/User');

mongoose.connect(keys.mongoURI);

const User = mongoose.model('users');

const init = async () => {

        const server = Hapi.server({
            port: 3000,
            host: 'localhost'
        });

        await server.register(require('@hapi/cookie'));

        server.auth.strategy('session', 'cookie', {
            cookie: {
                name: 'auth',
                password: keys.authCookiePassword,
                isSecure: false
            },
            redirectTo: '/login',
            validateFunc: async (request, session) => {
                User.findOne({id: session.id})
                    .then((user) => {
                        if (!user) {
                            return {
                                valid: false
                            };
                        } else {
                            return {
                                valid: true,
                                credentials: user
                            };
                        }
                    });
            }
        });

        server.auth.default('session');

        server.route(routes);

        await server.start();
        console.log('Server running on %s', server.info.uri);
    }
;

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();