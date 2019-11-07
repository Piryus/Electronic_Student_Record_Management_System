'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const keys = require('./config/keys');
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
                        }
                    )
                ;
            }
        })
        ;

        server.auth.default('session');

        server.route([
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
                                    resolve('Success/');
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
        ]);

        await server.start();
        console.log('Server running on %s', server.info.uri);
    }
;

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();