'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const HLib = require('@emarkk/hlib');

const Teacher = require('../models/Teacher');
const Lecture = require('../models/Lecture');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const SchoolClass = require ('../models/SchoolClass');

const lectures = require ('../routes/lectures/handlers');

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


suite('lectures', () => {
    
    test('getDailyLectureTopics', async () => {
        await Teacher.insertMany(testData.teachers);
        await Lecture.insertMany([
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '0_3', date: HLib.weekhourToDate('0_3'), topics: 'Test topics' },
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '2_4', date: HLib.weekhourToDate('2_4'), topics: 'Other topics' }
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
        expect(t3.topics).to.be.null();
        expect(t4.topics).to.equal('Test topics');
    });
    
    test('recordDailyLectureTopics', async () => {
        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-11-20T15:00:00').getTime());

        await Teacher.insertMany(testData.teachers);
        await Lecture.insertMany([
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '0_2', date: HLib.weekhourToDate('0_2'), topics: 'Test topics' },
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '4_4', date: HLib.weekhourToDate('4_4'), topics: 'Other topics' }
        ]);

        // teacher not found
        const t1 = await lectures.recordDailyLectureTopics('ffffffffffffffffffffffff', '1_1', 'Topics');
        // teacher has no lecture on that weekhour
        const t2 = await lectures.recordDailyLectureTopics('5dca7e2b461dc52d681804f4', '1_1', 'Topics');
        // future weekhour
        const t3 = await lectures.recordDailyLectureTopics('5dca7e2b461dc52d681804f4', '4_5', 'Topics');

        const t4 = await Lecture.findOne({ date: HLib.weekhourToDate('0_2') });
        const t5 = await Lecture.findOne({ date: HLib.weekhourToDate('4_5') });

        fakeClock.returns(new Date('2019-11-23T21:00:00').getTime());
        // ok 1 (lecture topics already entered)
        const t6 = await lectures.recordDailyLectureTopics('5dca7e2b461dc52d681804f4', '0_2', 'Updated topics');
        // ok 2 (no lecture topics were entered)
        const t7 = await lectures.recordDailyLectureTopics('5dca7e2b461dc52d681804f4', '4_5', 'New topics');
        
        const t8 = await Lecture.findOne({ date: HLib.weekhourToDate('0_2') });
        const t9 = await Lecture.findOne({ date: HLib.weekhourToDate('4_5') });
        
        fakeClock.restore();
        
        expect(t1.output.statusCode).to.equal(BAD_REQUEST);
        expect(t2.output.statusCode).to.equal(BAD_REQUEST);
        expect(t3.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(t4).to.include({ topics: 'Test topics' });
        expect(t5).to.be.null();
        expect(t6.success).to.be.true();
        expect(t7.success).to.be.true();
        jexpect(t8).to.include({ topics: 'Updated topics' });
        jexpect(t9).to.include({ topics: 'New topics' });
    });
    
    test('getAssignments', async () => {
        const data = [
            { subject: 'Italian', description: 'Lorem ipsum dolor sit amet', assigned: new Date('2019-10-14T10:00:00'), due: new Date().addDays(1) },
            { subject: 'Math', description: 'consectetur adipiscing elit', assigned: new Date('2019-11-05T12:00:00'), due: new Date().addDays(-2) },
            { subject: 'English', description: 'sed do eiusmod tempor incididunt', assigned: new Date('2019-10-01T09:00:00'), due: new Date().addDays(0) },
            { subject: 'Gym', description: 'ut labore et dolore magna aliqua', assigned: new Date('2019-11-19T11:00:00'), due: new Date().addDays(5) },
            { subject: 'Art', description: 'Ut enim ad minim veniam', assigned: new Date('2019-11-15T08:00:00'), due: new Date().addDays(3) },
            { subject: 'Physics', description: 'quis nostrud exercitation ullamco', assigned: new Date('2019-11-20T11:00:00'), due: new Date().addDays(-1) }
        ];

        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await SchoolClass.insertMany(testData.classes);

        await SchoolClass.updateOne({ _id: '5dc9c3112d698031f441e1c9' }, { assignments: data });

        // parent not found
        const g1 = await lectures.getAssignments('ffffffffffffffffffffffff', '5dca711c89bf46419cf5d489');
        // student not found
        const g2 = await lectures.getAssignments('5dca7e2b461dc52d681804fb', 'ffffffffffffffffffffffff');
        // student is not child of parent
        const g3 = await lectures.getAssignments('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d48f');
        // ok
        const g4 = await lectures.getAssignments('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d489');
        
        expect(g1.output.statusCode).to.equal(BAD_REQUEST);
        expect(g2.output.statusCode).to.equal(BAD_REQUEST);
        expect(g3.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(g4.assignments).to.equal(j(data.filter(a => a.due >= new Date().dayStart())));
    });

    test('getAttendance', async () => {
        const data = [
            { studentId: '5dca711c89bf46419cf5d485', attendanceEvents: [
                { date: new Date('2019-11-15T12:00:00'), event: 'early-exit' },
                { date: new Date('2019-11-27T08:00:00'), event: 'absence' },
                { date: new Date('2019-11-27T09:00:00'), event: 'late-entry' }
            ] },
            { studentId: '5dca711c89bf46419cf5d489', attendanceEvents: [
                { date: new Date('2019-11-24T12:00:00'), event: 'early-exit' },
                { date: new Date('2019-11-27T08:00:00'), event: 'absence' }
            ] },
            { studentId: '5dca711c89bf46419cf5d48b', attendanceEvents: [
                { date: new Date('2019-11-15T12:00:00'), event: 'early-exit' },
                { date: new Date('2019-11-27T16:00:00'), event: 'absence' },
                { date: new Date('2019-11-28T11:00:00'), event: 'early-exit' }
            ] },
            { studentId: '5dca711c89bf46419cf5d48f', attendanceEvents: [
                { date: new Date('2019-11-15T08:00:00'), event: 'absence' },
                { date: new Date('2019-11-15T09:00:00'), event: 'late-entry' }
            ] },
            { studentId: '5dca711c89bf46419cf5d491', attendanceEvents: [
                { date: new Date('2019-11-12T08:00:00'), event: 'absence' },
                { date: new Date('2019-11-15T12:00:00'), event: 'early-exit' },
                { date: new Date('2019-11-27T16:00:00'), event: 'absence' }
            ] }
        ];

        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-11-27T16:00:00').getTime());

        await Student.insertMany(testData.students);
        await Teacher.insertMany(testData.teachers);
        await Promise.all(data.map(i => Student.updateOne({ _id: i.studentId }, { attendanceEvents: i.attendanceEvents })));

        // teacher not found
        const a1 = await lectures.getAttendance('ffffffffffffffffffffffff');
        // teacher has no lecture on first hour today
        const a2 = await lectures.getAttendance('5dca7e2b461dc52d681804f6');
        // ok 1
        const a3 = await lectures.getAttendance('5dca7e2b461dc52d681804f1');

        fakeClock.returns(new Date('2019-11-15T08:01:00').getTime());
        // ok 2
        const a4 = await lectures.getAttendance('5dca7e2b461dc52d681804f2');

        fakeClock.restore();

        expect(a1.output.statusCode).to.equal(BAD_REQUEST);
        expect(a2.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(a3.classAttendance.sort((a, b) => b.id.toString() - a.id.toString())).to.equal(j(testData.students.filter(s => s.classId === '5dc9c3112d698031f441e1c9').map(s => {
            return { id: s._id, events: data.some(i => i.studentId === s._id) ? data.find(i => i.studentId === s._id).attendanceEvents.filter(ae => ae.date.isSameDayOf(new Date('2019-11-27T16:00:00'))) : [] };
        }).sort((a, b) => b.id - a.id)));
        jexpect(a4.classAttendance.sort((a, b) => b.id.toString() - a.id.toString())).to.equal(j(testData.students.filter(s => s.classId === '5dc9c3112d698031f441e1c9').map(s => {
            return { id: s._id, events: data.some(i => i.studentId === s._id) ? data.find(i => i.studentId === s._id).attendanceEvents.filter(ae => ae.date.isSameDayOf(new Date('2019-11-15T08:01:00'))) : [] };
        }).sort((a, b) => b.id - a.id)));
    });
    
    test('recordAssignments', async () => {
        const daysDelta = (new Date().addDays(14).weekStart().getTime() - new Date().weekStart().getTime()) / HLib.day;
        
        await Teacher.insertMany(testData.teachers);
        await SchoolClass.insertMany(testData.classes);
        
        // teacher not found
        const a1 = await lectures.recordAssignments('ffffffffffffffffffffffff', 'English', 'Assignments description here', HLib.weekhourToDate('3_3').addDays(daysDelta));
        // null weekhour
        const a2 = await lectures.recordAssignments('5dca7e2b461dc52d681804f5', 'English', 'Assignments description here', new Date('2019-11-24T10:00:00'));
        // no lecture on weekhour
        const a3 = await lectures.recordAssignments('5dca7e2b461dc52d681804f5', 'English', 'Assignments description here', HLib.weekhourToDate('3_3').addDays(daysDelta));
        // wrong subject
        const a4 = await lectures.recordAssignments('5dca7e2b461dc52d681804f5', 'Latin', 'Assignments description here', HLib.weekhourToDate('1_2').addDays(daysDelta));
        // due date in the past
        const a5 = await lectures.recordAssignments('5dca7e2b461dc52d681804f5', 'English', 'Assignments description here', HLib.weekhourToDate('1_2').addDays(-7));

        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-11-26T08:00:00').getTime());
        // due date is today
        const a6 = await lectures.recordAssignments('5dca7e2b461dc52d681804f5', 'English', 'Assignments description here', new Date('2019-11-26T09:00:00'));
        fakeClock.restore();

        const sc1 = await SchoolClass.findOne({ _id: '5dc9c3112d698031f441e1c9' });

        // ok
        const a7 = await lectures.recordAssignments('5dca7e2b461dc52d681804f5', 'English', 'New assignments!', HLib.weekhourToDate('1_2').addDays(daysDelta));

        const sc2 = await SchoolClass.findOne({ _id: '5dc9c3112d698031f441e1c9' });

        expect(a1.output.statusCode).to.equal(BAD_REQUEST);
        expect(a2.output.statusCode).to.equal(BAD_REQUEST);
        expect(a3.output.statusCode).to.equal(BAD_REQUEST);
        expect(a4.output.statusCode).to.equal(BAD_REQUEST);
        expect(a5.output.statusCode).to.equal(BAD_REQUEST);
        expect(a6.output.statusCode).to.equal(BAD_REQUEST);
        expect(sc1.assignments).to.have.length(0);
        expect(a7.success).to.be.true();
        expect(sc2.assignments).to.have.length(1);
        jexpect(sc2.assignments[0]).to.include(j({ subject: 'English', description: 'New assignments!', due: HLib.weekhourToDate('1_2').addDays(daysDelta) }));
    });
    
    test('rollCall', async () => {
        const data1 = [
            { studentId: '5dca711c89bf46419cf5d483', present: true },
            { studentId: '5dca711c89bf46419cf5d484', present: false },
            { studentId: '5dca711c89bf46419cf5d485', present: true },
            { studentId: '5dca711c89bf46419cf5d487', present: true },
            { studentId: '5dca711c89bf46419cf5d488', present: true },
            { studentId: '5dca711c89bf46419cf5d489', present: true },
            { studentId: '5dca711c89bf46419cf5d48b', present: true },
            { studentId: '5dca711c89bf46419cf5d48c', present: false },
            { studentId: '5dca711c89bf46419cf5d48e', present: true },
            { studentId: '5dca711c89bf46419cf5d48f', present: false },
            { studentId: '5dca711c89bf46419cf5d491', present: false }
        ];
        const data2 = [
            { studentId: '5dca711c89bf46419cf5d483', present: true },
            { studentId: '5dca711c89bf46419cf5d484', present: true },
            { studentId: '5dca711c89bf46419cf5d485', present: false },
            { studentId: '5dca711c89bf46419cf5d487', present: true },
            { studentId: '5dca711c89bf46419cf5d488', present: true },
            { studentId: '5dca711c89bf46419cf5d489', present: true },
            { studentId: '5dca711c89bf46419cf5d48b', present: true },
            { studentId: '5dca711c89bf46419cf5d48c', present: false },
            { studentId: '5dca711c89bf46419cf5d48e', present: false },
            { studentId: '5dca711c89bf46419cf5d48f', present: true },
            { studentId: '5dca711c89bf46419cf5d491', present: true }
        ];

        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-11-26T16:00:00').getTime());
        
        await Student.insertMany(testData.students);
        await Teacher.insertMany(testData.teachers);

        // teacher not found
        const rc1 = await lectures.rollCall('ffffffffffffffffffffffff', data1);
        // teacher has no lecture on first hour today
        const rc2 = await lectures.rollCall('5dca7e2b461dc52d681804f6', data1);
        // students list not complete
        const rc3 = await lectures.rollCall('5dca7e2b461dc52d681804f1', [
            { studentId: '5dca711c89bf46419cf5d485', present: true },
            { studentId: '5dca711c89bf46419cf5d48b', present: false },
            { studentId: '5dca711c89bf46419cf5d48f', present: true },
        ]);
        // some students not belonging to considered class
        const rc4 = await lectures.rollCall('5dca7e2b461dc52d681804f1', [
            { studentId: '5dca711c89bf46419cf5d486', present: true },
            { studentId: '5dca711c89bf46419cf5d487', present: false },
            { studentId: '5dca711c89bf46419cf5d488', present: true },
            { studentId: '5dca711c89bf46419cf5d489', present: true },
            { studentId: '5dca711c89bf46419cf5d48a', present: true },
            { studentId: '5dca711c89bf46419cf5d48b', present: true },
            { studentId: '5dca711c89bf46419cf5d48c', present: true },
            { studentId: '5dca711c89bf46419cf5d48d', present: false },
            { studentId: '5dca711c89bf46419cf5d48e', present: true },
            { studentId: '5dca711c89bf46419cf5d48f', present: false },
            { studentId: '5dca711c89bf46419cf5d491', present: true },
        ]);
        // ok
        const rc5 = await lectures.rollCall('5dca7e2b461dc52d681804f1', data1);
        const st1 = await Student.find({ classId: '5dc9c3112d698031f441e1c9' }, { 'attendanceEvents._id': 0 });
        // ok (change)
        const rc6 = await lectures.rollCall('5dca7e2b461dc52d681804f1', data2);
        const st2 = await Student.find({ classId: '5dc9c3112d698031f441e1c9' }, { 'attendanceEvents._id': 0 });


        fakeClock.restore();

        expect(rc1.output.statusCode).to.equal(BAD_REQUEST);
        expect(rc2.output.statusCode).to.equal(BAD_REQUEST);
        expect(rc3.output.statusCode).to.equal(BAD_REQUEST);
        expect(rc4.output.statusCode).to.equal(BAD_REQUEST);
        expect(rc5.success).to.be.true();
        data1.forEach(i => jexpect(st1.find(s => s._id.toString() === i.studentId).attendanceEvents).to.equal(j(i.present ? [] : [
            { date: new Date('2019-11-26T08:00:00'), event: 'absence' }
        ])));
        expect(rc6.success).to.be.true();
        data2.forEach(i => jexpect(st2.find(s => s._id.toString() === i.studentId).attendanceEvents).to.equal(j(i.present ? [] : [
            { date: new Date('2019-11-26T08:00:00'), event: 'absence' }
        ])));
    });

});