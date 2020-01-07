'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const Student = require('../models/Student');
const Parent = require('../models/Parent');

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

});