'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const Utils = require('../utils');

const Teacher = require('../models/Teacher');
const Lecture = require('../models/Lecture');

const lectures = require ('../routes/lectures/handlers');

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
    
    test('getDailyLectureTopics', async () => {
        await Teacher.insertMany(testData.teachers);
        await Lecture.insertMany([
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '0_3', date: Utils.weekhourToDate('0_3'), topics: 'Test topics' },
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '2_4', date: Utils.weekhourToDate('2_4'), topics: 'Other topics' }
        ]);

        // teacher not found
        const g1 = await lectures.getDailyLectureTopics('ffffffffffffffffffffffff', '1_1');
        // teacher has no lecture on that weekhour
        const g2 = await lectures.getDailyLectureTopics('5dca7e2b461dc52d681804f3', '1_1');
        // ok 1 (no lecture topics)
        const g3 = await lectures.getDailyLectureTopics('5dca7e2b461dc52d681804f3', '4_2');
        // ok 2 (lecture topics already entered)
        const g4 = await lectures.getDailyLectureTopics('5dca7e2b461dc52d681804f3', '0_3');
        
        expect(g1.output.statusCode).to.equal(BAD_REQUEST);
        expect(g2.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(g3.topics).to.be.null();
        jexpect(g4.topics).to.equal('Test topics');
    });
    
    test('recordDailyLectureTopics', async () => {
    });

});