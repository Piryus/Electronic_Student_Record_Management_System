'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

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
        const t1 = await lectures.getDailyLectureTopics('ffffffffffffffffffffffff', '1_1');
        // teacher has no lecture on that weekhour
        const t2 = await lectures.getDailyLectureTopics('5dca7e2b461dc52d681804f3', '1_1');
        // ok 1 (no lecture topics were entered)
        const t3 = await lectures.getDailyLectureTopics('5dca7e2b461dc52d681804f3', '4_2');
        // ok 2 (lecture topics already entered)
        const t4 = await lectures.getDailyLectureTopics('5dca7e2b461dc52d681804f3', '0_3');
        
        expect(t1.output.statusCode).to.equal(BAD_REQUEST);
        expect(t2.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(t3.topics).to.be.null();
        jexpect(t4.topics).to.equal('Test topics');
    });
    
    test('recordDailyLectureTopics', async () => {
        const fakeClock = Sinon.stub(Date, 'now');

        await Teacher.insertMany(testData.teachers);
        await Lecture.insertMany([
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '0_2', date: Utils.weekhourToDate('0_2'), topics: 'Test topics' },
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '4_4', date: Utils.weekhourToDate('4_4'), topics: 'Other topics' }
        ]);

        // teacher not found
        const t1 = await lectures.recordDailyLectureTopics('ffffffffffffffffffffffff', '1_1', 'Topics');
        // teacher has no lecture on that weekhour
        const t2 = await lectures.recordDailyLectureTopics('5dca7e2b461dc52d681804f4', '1_1', 'Topics');
        // future weekhour
        fakeClock.returns(new Date('2019-11-20T15:00:00.000Z'));
        const t3 = await lectures.recordDailyLectureTopics('5dca7e2b461dc52d681804f4', '4_5', 'Topics');

        const t4 = await Lecture.findOne({ date: Utils.weekhourToDate('0_2') });
        const t5 = await Lecture.findOne({ date: Utils.weekhourToDate('4_5') });

        fakeClock.returns(new Date('2019-11-23T21:00:00.000Z'));
        // ok 1 (lecture topics already entered)
        const t6 = await lectures.recordDailyLectureTopics('5dca7e2b461dc52d681804f4', '0_2', 'Updated topics');
        // ok 2 (no lecture topics were entered)
        const t7 = await lectures.recordDailyLectureTopics('5dca7e2b461dc52d681804f4', '4_5', 'New topics');
        
        const t8 = await Lecture.findOne({ date: Utils.weekhourToDate('0_2') });
        const t9 = await Lecture.findOne({ date: Utils.weekhourToDate('4_5') });
        
        expect(t1.output.statusCode).to.equal(BAD_REQUEST);
        expect(t2.output.statusCode).to.equal(BAD_REQUEST);
        expect(t3.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(t4).to.include({ topics: 'Test topics' });
        jexpect(t5).to.be.null();
        jexpect(t6.success).to.be.true();
        jexpect(t7.success).to.be.true();
        jexpect(t8).to.include({ topics: 'Updated topics' });
        jexpect(t9).to.include({ topics: 'New topics' });

        fakeClock.restore();
    });

});