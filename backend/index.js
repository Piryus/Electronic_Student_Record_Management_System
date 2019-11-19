'use strict';

const mongoose = require('mongoose');

const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);
mongoose.set('useFindAndModify', false);

const start = async () => {
    const server = await require('./server')({ request: ['implementation'] });
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

start();