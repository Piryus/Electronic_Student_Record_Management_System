'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const db = require('../test-lib/db');

const utils = require ('../utils');
const welcomeEmail = require ('../utils/welcomeEmail');

const expect = Code.expect;
const j = (x) => JSON.parse(JSON.stringify(x));
const jexpect = (x) => expect(j(x));
const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;
const before = lab.before;
const afterEach = lab.afterEach;
const after = lab.after;

before(async () =>  await db.connect());

afterEach(async () => await db.clearDatabase());

after(async () => await db.closeDatabase());

suite('utils', () => {

    test('welcomeEmail', async () => {
        const email = welcomeEmail('MYNAME', 'secretpassword');

        expect(email).to.be.a.string();
        expect(email.indexOf('MYNAME')).to.not.equal(-1);
        expect(email.indexOf('secretpassword')).to.not.equal(-1);
    });

});