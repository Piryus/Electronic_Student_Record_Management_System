'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const Utils = require('../utils');

const Parent = require('../models/Parent');
const Student = require('../models/Student');
const User = require('../models/User');

const secretary = require ('../routes/secretary/handlers');

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


suite('secretary', () => {
    
    test('addParent', async () => {
        const getRandomPassword = Sinon.stub(Utils, 'getRandomPassword').returns('q34!.7tv4t78R%329n,w90w');
        const sendWelcomeEmail = Sinon.stub(Utils, 'sendWelcomeEmail');

        await Parent.insertMany(testData.parents);
        await Student.insertMany(testData.students);
        await User.insertMany(testData.users);

        // email address already exists
        const a1 = await secretary.addParent('CMDFUR58H28D382T', 'Abbah', 'Lucex', 'davide.capon@parent.com', 'FHCBUT23D54V786X');
        // student not found
        const a2 = await secretary.addParent('CMDFUR58H28D382T', 'Abbah', 'Lucex', 'abbah.lucex@parent.com', 'FHCBUT23D54V786X');

        const u1 = await User.findOne({ ssn: 'CMDFUR58H28D382T' });

        // ok
        const a3 = await secretary.addParent('CMDFUR58H28D382T', 'Abbah', 'Lucex', 'abbah.lucex@parent.com', 'GPNCID08N09N089B');

        const u2 = await User.findOne({ ssn: 'CMDFUR58H28D382T' });
        const p2 = await Parent.findOne({ userId: u2._id });

        expect(u1).to.be.null();
        jexpect(u2).to.include({ ssn: 'CMDFUR58H28D382T', name: 'Abbah', surname: 'Lucex', mail: 'abbah.lucex@parent.com', scope: ['parent'] });
        jexpect(p2).to.include({ userId: u2._id.toString(), children: ['5dca711c89bf46419cf5d490'] });
        
        expect(a1.output.statusCode).to.equal(BAD_REQUEST);
        expect(a2.output.statusCode).to.equal(BAD_REQUEST);
        expect(a3.success).to.be.true();

        expect(getRandomPassword.callCount).to.equal(1);
        expect(sendWelcomeEmail.callCount).to.equal(1);
        expect(sendWelcomeEmail.calledWithExactly('abbah.lucex@parent.com', 'Abbah Lucex', 'q34!.7tv4t78R%329n,w90w')).to.be.true();

        getRandomPassword.restore();
        sendWelcomeEmail.restore();
    });

});