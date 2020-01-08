'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const HLib = require('@emarkk/hlib');

const SchoolClass = require('../models/SchoolClass');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Teacher = require('../models/Teacher');
const User = require ('../models/User');

const teachers = require ('../routes/teachers/handlers');

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

suite('teachers', () => {

    test('getNotes', async () => {
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await Teacher.insertMany(testData.teachers);
        await User.insertMany(testData.users);

        // teacher not found
        const n1 = await teachers.getNotes('ffffffffffffffffffffffff');

        // ok 1
        const n2 = await teachers.getNotes('5dca7e2b461dc52d681804f5');
        
        await Student.updateOne({ _id: '5dca711c89bf46419cf5d489' }, { notes: [
            { _id: '5dca7e2bfcc5b52d681804f6', teacherId: '5dca6cf0a92bbb4dd8c0e817', description: 'This is a first notice.', date: new Date('2019-11-10T10:06:04') },
            { _id: '5dca7e2bfcc5b52d681804f7', teacherId: '5dca6cd5b83a1f3ef03e962b', description: 'The situation is getting worse.', date: new Date('2019-11-18T11:02:19') }
        ] });
        
        // ok 2
        const n3 = await teachers.getNotes('5dca7e2b461dc52d681804f5');

        await Student.updateOne({ _id: '5dca711c89bf46419cf5d48e' }, { notes: [
            { _id: '5dca7e2bfcc5b52d681804f6', teacherId: '5dca6cf0a92bbb4dd8c0e817', description: 'Really bad.', date: new Date('2019-11-14T12:13:46') }
        ] });
        
        // ok 3
        const n4 = await teachers.getNotes('5dca7e2b461dc52d681804f5');
        
        expect(n1.output.statusCode).to.equal(BAD_REQUEST);
        expect(n2.notes).to.have.length(0);
        expect(n3.notes).to.have.length(1);
        jexpect(n3.notes[0]).to.equal(j({ teacherId: '5dca6cf0a92bbb4dd8c0e817', description: 'This is a first notice.', date: new Date('2019-11-10T10:06:04'), studentId: '5dca711c89bf46419cf5d489', student: 'Enzo Cremonesi' }));
        expect(n4.notes).to.have.length(2);
        jexpect(n4.notes[0]).to.equal(j({ teacherId: '5dca6cf0a92bbb4dd8c0e817', description: 'Really bad.', date: new Date('2019-11-14T12:13:46'), studentId: '5dca711c89bf46419cf5d48e', student: 'Anna Bianchi' }));
        jexpect(n4.notes[1]).to.equal(j({ teacherId: '5dca6cf0a92bbb4dd8c0e817', description: 'This is a first notice.', date: new Date('2019-11-10T10:06:04'), studentId: '5dca711c89bf46419cf5d489', student: 'Enzo Cremonesi' }));
    });

    test('getMeetingsAvailability', async () => {
        const data = ['0_4', '1_3', '3_2'];

        await Teacher.insertMany(testData.teachers);

        // teacher not found
        const ma1 = await teachers.getMeetingsAvailability('ffffffffffffffffffffffff');
        // ok 1
        const ma2 = await teachers.getMeetingsAvailability('5dca7e2b461dc52d681804f2');

        await Teacher.updateOne({ _id: '5dca69cf048e8e40d434017f' }, { meetingsTimeSlots: data });
        
        // ok 2
        const ma3 = await teachers.getMeetingsAvailability('5dca7e2b461dc52d681804f2');

        expect(ma1.output.statusCode).to.equal(BAD_REQUEST);
        expect(ma2.timeSlots).to.have.length(0);
        expect(ma3.timeSlots).to.have.length(3);
        expect(ma3.timeSlots).to.equal(data);
    });

    test('getAvailableMeetingsSlots', async () => {
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await Teacher.insertMany(testData.teachers);

        await Teacher.updateOne({ _id: '5dca69cf048e8e40d434017f' }, { meetingsTimeSlots: ['0_2', '1_0', '2_3', '4_2'] });
        await Teacher.updateOne({ _id: '5dca6d0801ea271794cb650e' }, { meetingsTimeSlots: ['1_3', '4_0'] });
        
        await Teacher.updateOne({ _id: '5dca69cf048e8e40d434017f' }, { meetings: [
            { parent: '5dca781462307a4f84dd86d5', date: new Date('2019-12-09T10:45:00') },
            { parent: '5dca78645953000328b6131b', date: new Date('2019-12-11T11:00:00') },
            { parent: '5dca77de05972e0898e9c68d', date: new Date('2019-12-11T11:15:00') }
        ] });
        await Teacher.updateOne({ _id: '5dca6d0801ea271794cb650e' }, { meetings: [
            { parent: '5dca7825e60dac32e4828699', date: new Date('2019-12-13T08:30:00') }
        ] });
        
        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-12-11T08:00:00').getTime());

        // parent not found
        const ams1 = await teachers.getAvailableMeetingsSlots('ffffffffffffffffffffffff', '5dca69cf048e8e40d434017f');
        // teacher not found
        const ams2 = await teachers.getAvailableMeetingsSlots('5dca7e2b461dc52d681804fc', 'ffffffffffffffffffffffff');
        // teacher is not teaching to any of parent's children
        const ams3 = await teachers.getAvailableMeetingsSlots('5dca7e2b46ffff2d681804fe', '5dca69cf048e8e40d434017f');

        // ok 1
        const ams4 = await teachers.getAvailableMeetingsSlots('5dca7e2b461dc52d681804fc', '5dca69cf048e8e40d434017f');
        // ok 2
        const ams5 = await teachers.getAvailableMeetingsSlots('5dca7e2b461dc52d681804fc', '5dca6d0801ea271794cb650e');

        fakeClock.restore();

        expect(ams1.output.statusCode).to.equal(BAD_REQUEST);
        expect(ams2.output.statusCode).to.equal(BAD_REQUEST);
        expect(ams3.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(ams4.slots).to.equal(j([
            { date: new Date('2019-12-09T10:00:00'), available: true },
            { date: new Date('2019-12-09T10:15:00'), available: true },
            { date: new Date('2019-12-09T10:30:00'), available: true },
            { date: new Date('2019-12-09T10:45:00'), available: false },
            { date: new Date('2019-12-10T08:00:00'), available: true },
            { date: new Date('2019-12-10T08:15:00'), available: true },
            { date: new Date('2019-12-10T08:30:00'), available: true },
            { date: new Date('2019-12-10T08:45:00'), available: true },
            { date: new Date('2019-12-11T11:00:00'), available: false },
            { date: new Date('2019-12-11T11:15:00'), available: false },
            { date: new Date('2019-12-11T11:30:00'), available: true },
            { date: new Date('2019-12-11T11:45:00'), available: true },
            { date: new Date('2019-12-13T10:00:00'), available: true },
            { date: new Date('2019-12-13T10:15:00'), available: true },
            { date: new Date('2019-12-13T10:30:00'), available: true },
            { date: new Date('2019-12-13T10:45:00'), available: true },
        ]));
        jexpect(ams5.slots).to.equal(j([
            { date: new Date('2019-12-10T11:00:00'), available: true },
            { date: new Date('2019-12-10T11:15:00'), available: true },
            { date: new Date('2019-12-10T11:30:00'), available: true },
            { date: new Date('2019-12-10T11:45:00'), available: true },
            { date: new Date('2019-12-13T08:00:00'), available: true },
            { date: new Date('2019-12-13T08:15:00'), available: true },
            { date: new Date('2019-12-13T08:30:00'), available: false },
            { date: new Date('2019-12-13T08:45:00'), available: true },
        ]));
    });

    test('getTermGrades', async () => {
        const subjects = ['Italian', 'History', 'Math', 'Physics', 'Latin', 'Art', 'English', 'Science', 'Gym', 'Religion'];

        let data1 = [], data2 = [];
        for(let student of testData.students.filter(s => s.classId === '5dc9c3112d698031f441e1c9')) {
            let grades1 = {}, grades2 = {};
            for(let subject of subjects) {
                grades1[subject] = Math.floor(Math.random() * 10);
                grades2[subject] = Math.floor(Math.random() * 10);
            }
            data1.push({ studentId: student._id, surname: student.surname, name: student.name, grades: grades1 });
            data2.push({ studentId: student._id, surname: student.surname, name: student.name, grades: grades2 });
        }

        let data3 = [], data4 = [];
        for(let student of testData.students.filter(s => s.classId === '5dc9c3112d698031f441e1c9')) {
            let grades1 = [], grades2 = [];
            for(let subject of subjects) {
                grades1 = grades1.concat([...Array(4)].map(_ => {
                    return { value: Math.floor(Math.random() * 10).toString(), subject, date: new Date('2019-09-15T16:00:00').addDays(Math.floor(Math.random() * 133)) };
                }));
                grades2 = grades2.concat([...Array(4)].map(_ => {
                    return { value: Math.floor(Math.random() * 10).toString(), subject, date: new Date('2020-01-29T16:00:00').addDays(Math.floor(Math.random() * 133)) };
                }));
            }
            data3.push({ studentId: student._id, surname: student.surname, name: student.name, grades: grades1 });
            data4.push({ studentId: student._id, surname: student.surname, name: student.name, grades: grades2 });
        }

        await Teacher.insertMany(testData.teachers);
        await SchoolClass.insertMany(testData.classes);
        await Student.insertMany(testData.students);

        // teacher not found
        const tg1 = await teachers.getTermGrades('ffffffffffffffffffffffff');
        // teacher is not coordinator of any class
        const tg2 = await teachers.getTermGrades('5dca7e2b461dc52d681804f5');
        
        await Promise.all(data3.map(d => Student.updateOne({ _id: d.studentId }, { grades: d.grades })));
        
        // ok 1
        const tg3 = await teachers.getTermGrades('5dca7e2b461dc52d681804f1');

        await SchoolClass.updateOne({ _id: '5dc9c3112d698031f441e1c9' }, { termsEndings: [new Date('2020-01-28T16:00:00')] });
        await Promise.all(data1.map(d => Student.updateOne({ _id: d.studentId }, { termGrades: [d.grades] })));
        
        await Promise.all(data4.map(d => Student.updateOne({ _id: d.studentId }, { grades: d.grades.concat(data3.find(d3 => d3.studentId === d.studentId).grades) })));

        // ok 2
        const tg4 = await teachers.getTermGrades('5dca7e2b461dc52d681804f1');

        await SchoolClass.updateOne({ _id: '5dc9c3112d698031f441e1c9' }, { termsEndings: [new Date('2020-01-28T16:00:00'), new Date('2020-06-12T15:00:00')] });
        await Promise.all(data1.map(d => Student.updateOne({ _id: d.studentId }, { termGrades: [d.grades, data2.find(d2 => d2.studentId === d.studentId).grades] })));

        // ok 3
        const tg5 = await teachers.getTermGrades('5dca7e2b461dc52d681804f1');
        
        expect(tg1.output.statusCode).to.equal(BAD_REQUEST);
        expect(tg2.output.statusCode).to.equal(BAD_REQUEST);
        expect(tg3.assigned).to.equal([false, false]);
        expect(tg3.termGrades).to.equal([null, null]);
        jexpect(tg3.gradesSuggestions).to.equal([data3.map(d => {
            return { studentId: d.studentId, surname: d.surname, name: d.name, grades: HLib.getGradesAverages(d.grades) };
        }), null]);
        expect(tg4.assigned).to.equal([true, false]);
        jexpect(tg4.termGrades).to.equal([data1, null]);
        jexpect(tg4.gradesSuggestions).to.equal([null, data4.map(d => {
            return { studentId: d.studentId, surname: d.surname, name: d.name, grades: HLib.getGradesAverages(d.grades) };
        })]);
        expect(tg5.assigned).to.equal([true, true]);
        jexpect(tg5.termGrades).to.equal([data1, data2]);
        expect(tg5.gradesSuggestions).to.equal([null, null]);
    });

    test('setMeetingsAvailability', async () => {
        await Teacher.insertMany(testData.teachers);

        // teacher not found
        const ma1 = await teachers.setMeetingsAvailability('ffffffffffffffffffffffff', ['1_2', '4_0']);
        // use lecture time slot
        const ma2 = await teachers.setMeetingsAvailability('5dca7e2b461dc52d681804f3', ['1_2', '4_2']);

        const t1 = await Teacher.findById('5dca6cbe7adca3346c5983cb');
        
        // ok 1
        const ma3 = await teachers.setMeetingsAvailability('5dca7e2b461dc52d681804f3', ['1_5', '4_3']);

        const t2 = await Teacher.findById('5dca6cbe7adca3346c5983cb');
        
        // ok 2
        const ma4 = await teachers.setMeetingsAvailability('5dca7e2b461dc52d681804f3', []);

        const t3 = await Teacher.findById('5dca6cbe7adca3346c5983cb');
        
        // ok 2
        const ma5 = await teachers.setMeetingsAvailability('5dca7e2b461dc52d681804f3', ['2_0', '3_3', '4_1']);

        const t4 = await Teacher.findById('5dca6cbe7adca3346c5983cb');

        expect(ma1.output.statusCode).to.equal(BAD_REQUEST);
        expect(ma2.output.statusCode).to.equal(BAD_REQUEST);
        expect(t1.meetingsTimeSlots).to.have.length(0);
        expect(ma3.success).to.be.true();
        expect(t2.meetingsTimeSlots).to.have.length(2);
        expect(t2.meetingsTimeSlots).to.equal(['1_5', '4_3']);
        expect(ma4.success).to.be.true();
        expect(t3.meetingsTimeSlots).to.have.length(0);
        expect(ma5.success).to.be.true();
        expect(t4.meetingsTimeSlots).to.have.length(3);
        expect(t4.meetingsTimeSlots).to.equal(['2_0', '3_3', '4_1']);
    });

    test('bookMeetingSlot', async () => {
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await Teacher.insertMany(testData.teachers);
        
        await Teacher.updateOne({ _id: '5dca698eed550e4ca4aba7f5' }, { meetingsTimeSlots: ['0_3', '1_4', '2_3', '4_2'] });
        
        await Teacher.updateOne({ _id: '5dca698eed550e4ca4aba7f5' }, { meetings: [
            { parent: '5dca781462307a4f84dd86d5', date: new Date('2019-11-20T11:45:00') },
            { parent: '5dca78645953000328b6131b', date: new Date('2019-11-22T10:00:00') },
            { parent: '5dca7825e60dac32e4828699', date: new Date('2019-11-22T10:30:00') }
        ] });
        
        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-11-19T11:35:24').getTime());

        // parent not found
        const b1 = await teachers.bookMeetingSlot('ffffffffffffffffffffffff', '5dca698eed550e4ca4aba7f5');
        // teacher not found
        const b2 = await teachers.bookMeetingSlot('5dca7e2b461dc52d681804f9', 'ffffffffffffffffffffffff');
        // teacher is not teaching to any of parent's children
        const b3 = await teachers.bookMeetingSlot('5dca7e2b46ffff2d681804fe', '5dca698eed550e4ca4aba7f5');
        // booking in the past
        const b4 = await teachers.bookMeetingSlot('5dca7e2b461dc52d681804f9', '5dca698eed550e4ca4aba7f5', new Date('2019-11-18T11:15:00'));
        const b5 = await teachers.bookMeetingSlot('5dca7e2b461dc52d681804f9', '5dca698eed550e4ca4aba7f5', new Date('2019-11-19T10:00:00'));
        const b6 = await teachers.bookMeetingSlot('5dca7e2b461dc52d681804f9', '5dca698eed550e4ca4aba7f5', new Date('2019-11-19T11:36:10'));
        // booking weekhour not allocated for meetings
        const b7 = await teachers.bookMeetingSlot('5dca7e2b461dc52d681804f9', '5dca698eed550e4ca4aba7f5', new Date('2019-11-21T10:46:00'));
        const b8 = await teachers.bookMeetingSlot('5dca7e2b461dc52d681804f9', '5dca698eed550e4ca4aba7f5', new Date('2019-11-22T11:00:00'));
        // booking slot already busy
        const b9 = await teachers.bookMeetingSlot('5dca7e2b461dc52d681804f9', '5dca698eed550e4ca4aba7f5', new Date('2019-11-20T11:50:00'));
        const b10 = await teachers.bookMeetingSlot('5dca7e2b461dc52d681804f9', '5dca698eed550e4ca4aba7f5', new Date('2019-11-22T10:30:00'));

        const t1 = await Teacher.findById('5dca698eed550e4ca4aba7f5');
        
        // ok 1
        const b11 = await teachers.bookMeetingSlot('5dca7e2b461dc52d681804f9', '5dca698eed550e4ca4aba7f5', new Date('2019-11-20T11:00:00'));
        
        const t2 = await Teacher.findById('5dca698eed550e4ca4aba7f5');

        // ok 2
        const b12 = await teachers.bookMeetingSlot('5dca7e2b461dc52d681804fd', '5dca698eed550e4ca4aba7f5', new Date('2019-11-22T10:16:00'));
        
        const t3 = await Teacher.findById('5dca698eed550e4ca4aba7f5');

        fakeClock.restore();

        expect(b1.output.statusCode).to.equal(BAD_REQUEST);
        expect(b2.output.statusCode).to.equal(BAD_REQUEST);
        expect(b3.output.statusCode).to.equal(BAD_REQUEST);
        expect(b4.output.statusCode).to.equal(BAD_REQUEST);
        expect(b5.output.statusCode).to.equal(BAD_REQUEST);
        expect(b6.output.statusCode).to.equal(BAD_REQUEST);
        expect(b7.output.statusCode).to.equal(BAD_REQUEST);
        expect(b8.output.statusCode).to.equal(BAD_REQUEST);
        expect(b9.output.statusCode).to.equal(BAD_REQUEST);
        expect(b10.output.statusCode).to.equal(BAD_REQUEST);
        expect(t1.meetings).to.have.length(3);
        expect(b11.success).to.be.true();
        expect(t2.meetings).to.have.length(4);
        jexpect(t2.meetings.find(m => m.parent.equals('5dca77de05972e0898e9c68d')).date.getTime()).to.equal(new Date('2019-11-20T11:00:00').getTime());
        expect(b12.success).to.be.true();
        expect(t3.meetings).to.have.length(5);
        jexpect(t3.meetings.find(m => m.parent.equals('5dca784dcf1db14678f3cadb')).date.getTime()).to.equal(new Date('2019-11-22T10:15:00').getTime());
    });

    test('publishTermGrades', async () => {
        let data1 = [], data2 = [];
        for(let student of testData.students.filter(s => s.classId === '5dc9c3112d698031f441e1c9')) {
            let grades1 = {}, grades2 = {};
            for(let subject of ['Italian', 'History', 'Math', 'Physics', 'Latin', 'Art', 'English', 'Science', 'Gym', 'Religion']) {
                grades1[subject] = Math.floor(Math.random() * 10);
                grades2[subject] = Math.floor(Math.random() * 10);
            }
            data1.push({ studentId: student._id, grades: grades1 });
            data2.push({ studentId: student._id, grades: grades2 });
        }

        await Teacher.insertMany(testData.teachers);
        await SchoolClass.insertMany(testData.classes);
        await Student.insertMany(testData.students);

        // teacher not found
        const ptg1 = await teachers.publishTermGrades('ffffffffffffffffffffffff', data1);
        // teacher is not coordinator of any class
        const ptg2 = await teachers.publishTermGrades('5dca7e2b461dc52d681804f5', data1);

        await SchoolClass.updateOne({ _id: '5dc9c3112d698031f441e1c9' }, { termsEndings: [new Date(), new Date()] });

        // term grades for this class have already been published (for both terms)
        const ptg3 = await teachers.publishTermGrades('5dca7e2b461dc52d681804f1', data1);

        await SchoolClass.updateOne({ _id: '5dc9c3112d698031f441e1c9' }, { termsEndings: [] });
        
        // term grades missing for some students
        const ptg4 = await teachers.publishTermGrades('5dca7e2b461dc52d681804f1', [{
            studentId: '5dca711c89bf46419cf5d487',
            grades: { Italian: 6 }
        }]);
        // term grades with some students from other classes
        const ptg5 = await teachers.publishTermGrades('5dca7e2b461dc52d681804f1', [
            { studentId: '5dca711c89bf46419cf5d483', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d484', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48a', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d487', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d488', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d489', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48b', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48c', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48e', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48f', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d491', grades: { Italian: 6 } }
        ]);
        // term grades with some duplicated students
        const ptg6 = await teachers.publishTermGrades('5dca7e2b461dc52d681804f1', [
            { studentId: '5dca711c89bf46419cf5d483', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d484', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d485', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d487', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d488', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d489', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48b', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d488', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d483', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48f', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d491', grades: { Italian: 6 } }
        ]);
        // grades for all subjects not provided
        const ptg7 = await teachers.publishTermGrades('5dca7e2b461dc52d681804f1', [
            { studentId: '5dca711c89bf46419cf5d483', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d484', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d485', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d487', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d488', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d489', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48b', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48c', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48e', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48f', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d491', grades: { Italian: 6 } }
        ]);
        // grades for unknown subjects provided
        const ptg8 = await teachers.publishTermGrades('5dca7e2b461dc52d681804f1', [
            { studentId: '5dca711c89bf46419cf5d483', grades: { Hawaii: 6, Brazil: 7, Denmark: 4, Poland: 1, Germany: 8, Canada: 9, Turkey: 7, China: 2, Finland: 3, Iceland: 10 } },
            { studentId: '5dca711c89bf46419cf5d484', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d485', grades: { Ecuador: 6 } },
            { studentId: '5dca711c89bf46419cf5d487', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d488', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d489', grades: { Moon: 6 } },
            { studentId: '5dca711c89bf46419cf5d48b', grades: { Africa: 6 } },
            { studentId: '5dca711c89bf46419cf5d48c', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48e', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d48f', grades: { Italian: 6 } },
            { studentId: '5dca711c89bf46419cf5d491', grades: { China: 6 } }
        ]);

        const s1 = await Student.find();
        const sc1 = await SchoolClass.findById('5dc9c3112d698031f441e1c9');

        // ok 1
        const ptg9 = await teachers.publishTermGrades('5dca7e2b461dc52d681804f1', data1);
        
        const s2 = await Student.find();
        const sc2 = await SchoolClass.findById('5dc9c3112d698031f441e1c9');

        // ok 2
        const ptg10 = await teachers.publishTermGrades('5dca7e2b461dc52d681804f1', data2);
        
        const s3 = await Student.find();
        const sc3 = await SchoolClass.findById('5dc9c3112d698031f441e1c9');
        
        expect(ptg1.output.statusCode).to.equal(BAD_REQUEST);
        expect(ptg2.output.statusCode).to.equal(BAD_REQUEST);
        expect(ptg3.output.statusCode).to.equal(BAD_REQUEST);
        expect(ptg4.output.statusCode).to.equal(BAD_REQUEST);
        expect(ptg5.output.statusCode).to.equal(BAD_REQUEST);
        expect(ptg6.output.statusCode).to.equal(BAD_REQUEST);
        expect(ptg7.output.statusCode).to.equal(BAD_REQUEST);
        expect(ptg8.output.statusCode).to.equal(BAD_REQUEST);
        s1.filter(s => s.classId.equals('5dc9c3112d698031f441e1c9')).forEach(s => expect(s.termGrades).to.have.length(0));
        expect(sc1.termsEndings).to.have.length(0);
        expect(ptg9.success).to.be.true();
        s2.filter(s => s.classId.equals('5dc9c3112d698031f441e1c9')).forEach(s => {
            expect(s.termGrades).to.have.length(1);
            expect(s.termGrades[0]).to.equal(data1.find(d => s._id.equals(d.studentId)).grades);
        });
        expect(sc2.termsEndings).to.have.length(1);
        expect(Math.abs(sc2.termsEndings[0] - new Date())).to.be.lessThan(1000);
        expect(ptg10.success).to.be.true();
        s3.filter(s => s.classId.equals('5dc9c3112d698031f441e1c9')).forEach(s => {
            expect(s.termGrades).to.have.length(2);
            expect(s.termGrades[0]).to.equal(data1.find(d => s._id.equals(d.studentId)).grades);
            expect(s.termGrades[1]).to.equal(data2.find(d => s._id.equals(d.studentId)).grades);
        });
        expect(sc3.termsEndings).to.have.length(2);
        expect(Math.abs(sc3.termsEndings[0] - new Date())).to.be.lessThan(1000);
        expect(Math.abs(sc3.termsEndings[1] - new Date())).to.be.lessThan(1000);
    });

});