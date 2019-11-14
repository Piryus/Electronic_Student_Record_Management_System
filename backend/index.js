'use strict';

const mongoose = require('mongoose');

const server = require('./server');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

server();