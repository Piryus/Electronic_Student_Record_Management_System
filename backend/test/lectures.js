'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const expect = Code.expect;
const jexpect = (x) => expect(JSON.parse(JSON.stringify(x)));
const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;
const before = lab.before;
const afterEach = lab.afterEach;
const after = lab.after;

before(async () =>  await db.connect());

afterEach(async () => await db.clearDatabase());

after(async () => await db.closeDatabase());


suite('lectures', () => {
    
});