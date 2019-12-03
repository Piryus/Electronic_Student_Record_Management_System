'use strict';

const mongoose = require('mongoose');
const Sinon = require('sinon');

const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);
mongoose.set('useFindAndModify', false);

const start = async () => {
    const server = await require('./server')({ request: ['implementation'] });
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.argv.filter(arg => arg.indexOf('=') !== -1).map(arg => arg.split('=')).forEach(arg => {
    switch(arg[0]) {
        case 'datetime':
            Sinon.stub(Date, 'now').returns(new Date(arg[1]).getTime());
            break;
    }
});
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

start();