'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');

const keys = require('./config/keys');
const routes = require('./routes');

const cookieStrategy = require('./cookieStrategy');

mongoose.connect(keys.mongoURI);

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'], // an array of origins or 'ignore'
                headers: ['Authorization'], // an array of strings - 'Access-Control-Allow-Headers'
                exposedHeaders: ['Accept'], // an array of exposed headers - 'Access-Control-Expose-Headers',
                additionalExposedHeaders: ['Accept'], // an array of additional exposed headers
                maxAge: 60 * 60 * 1000 * 30,
                credentials: true // boolean - 'Access-Control-Allow-Credentials'
            }
        }
    });

    await server.register(require('@hapi/cookie'));
    
    server.auth.strategy('session', 'cookie', cookieStrategy);
    server.auth.default('session');

    server.route(routes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();