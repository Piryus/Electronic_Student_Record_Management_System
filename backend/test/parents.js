'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

const parents = require ('../routes/parents/handlers');

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

suite('parents', () => {

    test('getChildren', async () => {
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);

        // parent not found
        const c1 = await parents.getChildren('ffffffffffffffffffffffff');
        // ok 1
        const c2 = await parents.getChildren('5dca7e2b461dc52d681804fc');
        // ok 2
        const c3 = await parents.getChildren('5dca7e2b461dc52d681804fe');
        // ok 3
        const c4 = await parents.getChildren('5dca7e2b461dc52d681804fa');
        
        expect(c1.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(c2.children).to.equal([
            { id: '5dca711c89bf46419cf5d483', ssn: 'MDFGKO06L02F082G', name: 'Marco', surname: 'Cremonesi' },
            { id: '5dca711c89bf46419cf5d489', ssn: 'MGOAAP05I08P020M', name: 'Enzo', surname: 'Cremonesi' }
        ]);
        jexpect(c3.children).to.equal([
            { id: '5dca711c89bf46419cf5d48e', ssn: 'PBFNDJ01E04O002B', name: 'Anna', surname: 'Bianchi' },
            { id: '5dca711c89bf46419cf5d491', ssn: 'EOANEJ00J04K037K', name: 'Vittoria', surname: 'Bianchi' }
        ]);
        jexpect(c4.children).to.equal([
            { id: '5dca711c89bf46419cf5d485', ssn: 'JPCOME07O02C034H', name: 'Alice', surname: 'Capon' }
        ]);
    });

    test('getMeetingsBooked', async () => {
        await Parent.insertMany(testData.parents);
        await Teacher.insertMany(testData.teachers);
        await User.insertMany(testData.users);

        // parent not found
        const m1 = await parents.getMeetingsBooked('ffffffffffffffffffffffff');
        // ok 1
        const m2 = await parents.getMeetingsBooked('5dca7e2b461dc52d681804fb');
        // ok 2
        const m3 = await parents.getMeetingsBooked('5dca7e2b461dc52d681804fd');

        await Teacher.updateOne({ _id: '5dca69cf048e8e40d434017f' }, { meetings: [{ date: new Date('2019-12-10T11:00:00'), parent: '5dca784dcf1db14678f3cadb' }] });
        await Teacher.updateOne({ _id: '5dca6cf0a92bbb4dd8c0e817' }, { meetings: [{ date: new Date('2019-12-11T09:00:00'), parent: '5dca784dcf1db14678f3cadb' }] });

        // ok 3
        const m4 = await parents.getMeetingsBooked('5dca7e2b461dc52d681804fd');

        expect(m1.output.statusCode).to.equal(BAD_REQUEST);
        expect(m2.meetings).to.have.length(0);
        expect(m3.meetings).to.have.length(0);
        expect(m4.meetings).to.have.length(2);
        jexpect(m4.meetings).to.equal(j([
            { date: new Date('2019-12-10T11:00:00'), teacher: { _id: '5dca69cf048e8e40d434017f', ssn: 'CMFOLR29R45S203O', name: 'Roberta', surname: 'Verdi' } },
            { date: new Date('2019-12-11T09:00:00'), teacher: { _id: '5dca6cf0a92bbb4dd8c0e817', ssn: 'PLVCGT02S19R549A', name: 'Federica', surname: 'Valli' } }
        ]));
    });

});