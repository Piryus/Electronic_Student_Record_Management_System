'use strict';

const Hapi = require('@hapi/hapi');

const routes = require('./routes');
const cookieStrategy = require('./cookieStrategy');

const init = async (debug) => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        debug,
        routes: {
            cors: {
                origin: ['*'],
                maxAge: 86400,
                headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
                exposedHeaders: ['WWW-Authenticate', 'Server-Authorization'],
                credentials: true
            }
        }
    });

    await server.register(require('@hapi/cookie'));
    
    server.auth.strategy('session', 'cookie', cookieStrategy);
    server.auth.default('session');

    server.route(routes);
    return server;
    
};

module.exports = init;