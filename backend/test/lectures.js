'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const HLib = require('@emarkk/hlib');

const Utils = require('../utils');

const Calendar = require('../models/Calendar');
const File = require('../models/File');
const Teacher = require('../models/Teacher');
const Lecture = require('../models/Lecture');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const SchoolClass = require ('../models/SchoolClass');
const User = require('../models/User');

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
    
    test('getDailyLectureTopicsOfTeacher', async () => {
        await Calendar.insertMany(testData.calendar);
        await Teacher.insertMany(testData.teachers);
        
        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-11-22T14:00:00').getTime());

        await Lecture.insertMany([
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '0_3', date: HLib.weekhourToDate('0_3'), topics: 'Test topics' },
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '2_4', date: HLib.weekhourToDate('2_4'), topics: 'Other topics' }
        ]);

        // teacher not found
        const t1 = await lectures.getDailyLectureTopicsOfTeacher('ffffffffffffffffffffffff', '1_1');
        // teacher has no lecture on that weekhour
        const t2 = await lectures.getDailyLectureTopicsOfTeacher('5dca7e2b461dc52d681804f3', '1_1');

        fakeClock.returns(new Date('2019-12-26T10:00:00').getTime());

        // holiday
        const t3 = await lectures.getDailyLectureTopicsOfTeacher('5dca7e2b461dc52d681804f3', '2_4');

        fakeClock.returns(new Date('2019-11-22T14:00:00').getTime());

        // ok 1 (no lecture topics were entered)
        const t4 = await lectures.getDailyLectureTopicsOfTeacher('5dca7e2b461dc52d681804f3', '4_2');
        // ok 2 (lecture topics already entered)
        const t5 = await lectures.getDailyLectureTopicsOfTeacher('5dca7e2b461dc52d681804f3', '0_3');

        fakeClock.restore();
        
        expect(t1.output.statusCode).to.equal(BAD_REQUEST);
        expect(t2.output.statusCode).to.equal(BAD_REQUEST);
        expect(t3.output.statusCode).to.equal(BAD_REQUEST);
        expect(t4.topics).to.be.null();
        expect(t5.topics).to.equal('Test topics');
    });
    
    test('getDailyLectureTopicsForParent', async () => {
        await Calendar.insertMany(testData.calendar);
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await Teacher.insertMany(testData.teachers);
        await Lecture.insertMany([
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '0_3', date: new Date('2019-12-09T11:00:00'), topics: 'Test topics' },
            { classId: '5dc9c3112d698031f441e1c9', weekhour: '2_4', date: new Date('2019-11-20T12:00:00'), topics: 'Other topics' }
        ]);

        // parent not found
        const t1 = await lectures.getDailyLectureTopicsForParent('ffffffffffffffffffffffff', '5dca711c89bf46419cf5d485');
        // student not found
        const t2 = await lectures.getDailyLectureTopicsForParent('5dca7e2b461dc52d681804fa', 'ffffffffffffffffffffffff');
        // student is not child of parent
        const t3 = await lectures.getDailyLectureTopicsForParent('5dca7e2b461dc52d681804fa', '5dca711c89bf46419cf5d48f');
        // holiday
        const t4 = await lectures.getDailyLectureTopicsForParent('5dca7e2b461dc52d681804fa', '5dca711c89bf46419cf5d485', new Date('2019-12-25T11:00:00').getTime());

        // ok 1
        const t5 = await lectures.getDailyLectureTopicsForParent('5dca7e2b461dc52d681804fa', '5dca711c89bf46419cf5d485', new Date('2019-12-09T11:00:00').getTime());
        // ok 2
        const t6 = await lectures.getDailyLectureTopicsForParent('5dca7e2b461dc52d681804fa', '5dca711c89bf46419cf5d485', new Date('2019-11-29T10:02:00').getTime());
        // ok 3
        const t7 = await lectures.getDailyLectureTopicsForParent('5dca7e2b461dc52d681804fa', '5dca711c89bf46419cf5d485', new Date('2019-11-20T12:06:19').getTime());
        
        expect(t1.output.statusCode).to.equal(BAD_REQUEST);
        expect(t2.output.statusCode).to.equal(BAD_REQUEST);
        expect(t3.output.statusCode).to.equal(BAD_REQUEST);
        expect(t4.output.statusCode).to.equal(BAD_REQUEST);
        expect(t5.topics).to.equal('Test topics');
        expect(t6.topics).to.be.null();
        expect(t7.topics).to.equal('Other topics');
    });
    
    test('getSupportMaterials', async () => {
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await SchoolClass.insertMany(testData.classes);
        await File.insertMany([
            { _id: '5dc9c3112d698031f882d0c9', filename: 'periodic_table.txt', bytes: 4503, type: 'text/plain' },
            { _id: '5dc9c3112d698031f882d0ca', filename: 'math_formulas.pdf', bytes: 14039, type: 'application/pdf' },
            { _id: '5dc9c3112d698031f882d0cb', filename: 'divina_commedia.txt', bytes: 83264, type: 'text/plain' },
            { _id: '5dc9c3112d698031f882d0cc', filename: 'math_formulas_2.pdf', bytes: 9910, type: 'application/pdf' }
        ]);

        // parent not found
        const sm1 = await lectures.getSupportMaterials('ffffffffffffffffffffffff', '5dca711c89bf46419cf5d489');
        // student not found
        const sm2 = await lectures.getSupportMaterials('5dca7e2b461dc52d681804fb', 'ffffffffffffffffffffffff');
        // student is not child of parent
        const sm3 = await lectures.getSupportMaterials('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d48f');

        // ok 1
        const sm4 = await lectures.getSupportMaterials('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d489');

        await SchoolClass.updateOne({ _id: '5dc9c3112d698031f441e1c9' }, { supportMaterials: [
            { subject: 'Science', description: 'Periodic Table', uploaded: new Date('2019-12-01T14:02:19'), attachments: ['5dc9c3112d698031f882d0c9'] },
            { subject: 'Math', description: 'Formulas Cheatsheet', uploaded: new Date('2019-12-10T17:27:42'), attachments: ['5dc9c3112d698031f882d0ca'] },
            { subject: 'Italian', description: 'Divina Commedia', uploaded: new Date('2019-12-16T09:53:50'), attachments: ['5dc9c3112d698031f882d0cb'] },
            { subject: 'Math', description: 'Formulas Cheatsheet (2)', uploaded: new Date('2019-12-18T11:07:20'), attachments: ['5dc9c3112d698031f882d0cc'] }
        ] });
        
        // ok 2
        const sm5 = await lectures.getSupportMaterials('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d489');
        
        expect(sm1.output.statusCode).to.equal(BAD_REQUEST);
        expect(sm2.output.statusCode).to.equal(BAD_REQUEST);
        expect(sm3.output.statusCode).to.equal(BAD_REQUEST);
        expect(sm4.supportMaterials).to.have.length(0);
        expect(sm5.supportMaterials).to.have.length(3);
        jexpect(sm5.supportMaterials).to.equal(j({
            Italian: [{ subject: 'Italian', description: 'Divina Commedia', uploaded: new Date('2019-12-16T09:53:50'), attachments: [
                { _id: '5dc9c3112d698031f882d0cb', __v: 0, filename: 'divina_commedia.txt', bytes: 83264, type: 'text/plain' }
            ] }],
            Math: [
                { subject: 'Math', description: 'Formulas Cheatsheet', uploaded: new Date('2019-12-10T17:27:42'), attachments: [
                    { _id: '5dc9c3112d698031f882d0ca', __v: 0, filename: 'math_formulas.pdf', bytes: 14039, type: 'application/pdf' }
                ] },
                { subject: 'Math', description: 'Formulas Cheatsheet (2)', uploaded: new Date('2019-12-18T11:07:20'), attachments: [
                    { _id: '5dc9c3112d698031f882d0cc', __v: 0, filename: 'math_formulas_2.pdf', bytes: 9910, type: 'application/pdf' }
                ] }
            ],
            Science: [{ subject: 'Science', description: 'Periodic Table', uploaded: new Date('2019-12-01T14:02:19'), attachments: [
                { _id: '5dc9c3112d698031f882d0c9', __v: 0, filename: 'periodic_table.txt', bytes: 4503, type: 'text/plain' }
            ] }]
        }));
    });
    
    test('recordDailyLectureTopics', async () => {
        await Calendar.insertMany(testData.calendar);
        await Teacher.insertMany(testData.teachers);
        
        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-11-20T15:00:00').getTime());
        
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

        fakeClock.returns(new Date('2019-11-02T16:00:00').getTime());

        // holiday
        const t4 = await lectures.recordDailyLectureTopics('5dca7e2b461dc52d681804f4', '4_5', 'Topics');
        
        fakeClock.returns(new Date('2019-11-23T21:00:00').getTime());

        const t5 = await Lecture.findOne({ date: HLib.weekhourToDate('0_2') });
        const t6 = await Lecture.findOne({ date: HLib.weekhourToDate('4_5') });

        // ok 1 (lecture topics already entered)
        const t7 = await lectures.recordDailyLectureTopics('5dca7e2b461dc52d681804f4', '0_2', 'Updated topics');
        // ok 2 (no lecture topics were entered)
        const t8 = await lectures.recordDailyLectureTopics('5dca7e2b461dc52d681804f4', '4_5', 'New topics');
        
        const t9 = await Lecture.findOne({ date: HLib.weekhourToDate('0_2') });
        const t10 = await Lecture.findOne({ date: HLib.weekhourToDate('4_5') });
        
        fakeClock.restore();
        
        expect(t1.output.statusCode).to.equal(BAD_REQUEST);
        expect(t2.output.statusCode).to.equal(BAD_REQUEST);
        expect(t3.output.statusCode).to.equal(BAD_REQUEST);
        expect(t4.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(t5).to.include({ topics: 'Test topics' });
        expect(t6).to.be.null();
        expect(t7.success).to.be.true();
        expect(t8.success).to.be.true();
        jexpect(t9).to.include({ topics: 'Updated topics' });
        jexpect(t10).to.include({ topics: 'New topics' });
    });
    
    test('getAssignments', async () => {
        const data = [
            { subject: 'Italian', description: 'Lorem ipsum dolor sit amet', attachments: [], assigned: new Date('2019-10-14T10:00:00'), due: new Date().addDays(1) },
            { subject: 'Math', description: 'consectetur adipiscing elit', attachments: [], assigned: new Date('2019-11-05T12:00:00'), due: new Date().addDays(-2) },
            { subject: 'English', description: 'sed do eiusmod tempor incididunt', attachments: [], assigned: new Date('2019-10-01T09:00:00'), due: new Date().addDays(0) },
            { subject: 'Gym', description: 'ut labore et dolore magna aliqua', attachments: [], assigned: new Date('2019-11-19T11:00:00'), due: new Date().addDays(5) },
            { subject: 'Art', description: 'Ut enim ad minim veniam', attachments: [], assigned: new Date('2019-11-15T08:00:00'), due: new Date().addDays(3) },
            { subject: 'Physics', description: 'quis nostrud exercitation ullamco', attachments: [], assigned: new Date('2019-11-20T11:00:00'), due: new Date().addDays(-1) }
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

    test('getTimetable', async () => {
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await Teacher.insertMany(testData.teachers);
        await User.insertMany(testData.users);

        // parent not found
        const t1 = await lectures.getTimetable('ffffffffffffffffffffffff', '5dca711c89bf46419cf5d491');
        // student not found
        const t2 = await lectures.getTimetable('5dca7e2b461dc52d681804fe', 'ffffffffffffffffffffffff');
        // student is not child of parent
        const t3 = await lectures.getTimetable('5dca7e2b461dc52d681804fe', '5dca711c89bf46419cf5d48f');
        // ok
        const t4 = await lectures.getTimetable('5dca7e2b461dc52d681804fe', '5dca711c89bf46419cf5d491');

        expect(t1.output.statusCode).to.equal(BAD_REQUEST);
        expect(t2.output.statusCode).to.equal(BAD_REQUEST);
        expect(t3.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(t4.timetable).to.equal(j([
            { subject: 'Italian', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '0_1' },
            { subject: 'History', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '1_0' },
            { subject: 'Italian', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '1_1' },
            { subject: 'Italian', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '2_0' },
            { subject: 'Italian', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '2_1' },
            { subject: 'History', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '3_1' },
            { subject: 'Math', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '0_0' },
            { subject: 'Math', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '1_4' },
            { subject: 'Physics', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '1_5' },
            { subject: 'Math', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '3_2' },
            { subject: 'Math', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '3_3' },
            { subject: 'Physics', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '4_0' },
            { subject: 'Math', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '4_4' },
            { subject: 'Latin', teacher: { _id: '5dca6cbe7adca3346c5983cb', name: 'Stefano', ssn: 'LDFVUI17P04D491B', surname: 'Rossi' }, weekhour: '0_3' },
            { subject: 'Latin', teacher: { _id: '5dca6cbe7adca3346c5983cb', name: 'Stefano', ssn: 'LDFVUI17P04D491B', surname: 'Rossi' }, weekhour: '0_4' },
            { subject: 'Latin', teacher: { _id: '5dca6cbe7adca3346c5983cb', name: 'Stefano', ssn: 'LDFVUI17P04D491B', surname: 'Rossi' }, weekhour: '2_4' },
            { subject: 'Latin', teacher: { _id: '5dca6cbe7adca3346c5983cb', name: 'Stefano', ssn: 'LDFVUI17P04D491B', surname: 'Rossi' }, weekhour: '4_2' },
            { subject: 'Art', teacher: { _id: '5dca6cd5b83a1f3ef03e962b', name: 'Peter', ssn: 'SCBGMN21E45O956Q', surname: 'Posta' }, weekhour: '0_2' },
            { subject: 'Art', teacher: { _id: '5dca6cd5b83a1f3ef03e962b', name: 'Peter', ssn: 'SCBGMN21E45O956Q', surname: 'Posta' }, weekhour: '4_5' },
            { subject: 'English', teacher: { _id: '5dca6cf0a92bbb4dd8c0e817', name: 'Federica', ssn: 'PLVCGT02S19R549A', surname: 'Valli' }, weekhour: '1_2' },
            { subject: 'English', teacher: { _id: '5dca6cf0a92bbb4dd8c0e817', name: 'Federica', ssn: 'PLVCGT02S19R549A', surname: 'Valli' }, weekhour: '2_2' },
            { subject: 'English', teacher: { _id: '5dca6cf0a92bbb4dd8c0e817', name: 'Federica', ssn: 'PLVCGT02S19R549A', surname: 'Valli' }, weekhour: '3_0' },
            { subject: 'Science', teacher: { _id: '5dca6d0801ea271794cb650e', name: 'Cinzia', ssn: 'LCFTUI58S49G910R', surname: 'Tollo' }, weekhour: '2_3' },
            { subject: 'Science', teacher: { _id: '5dca6d0801ea271794cb650e', name: 'Cinzia', ssn: 'LCFTUI58S49G910R', surname: 'Tollo' }, weekhour: '4_3' },
            { subject: 'Gym', teacher: { _id: '5dca6d2038627d0bfc4167b0', name: 'Dario', ssn: 'QASVUM68G45D297P', surname: 'Resti' }, weekhour: '1_3' },
            { subject: 'Gym', teacher: { _id: '5dca6d2038627d0bfc4167b0', name: 'Dario', ssn: 'QASVUM68G45D297P', surname: 'Resti' }, weekhour: '4_1' },
            { subject: 'Religion', teacher: { _id: '5dca6d3620607b1e30dea42a', name: 'Nina', ssn: 'NCFTOG69F23B796K', surname: 'Fassio' }, weekhour: '3_4' }
        ]));
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

        await Calendar.insertMany(testData.calendar);
        await Student.insertMany(testData.students);
        await Teacher.insertMany(testData.teachers);
        await Promise.all(data.map(i => Student.updateOne({ _id: i.studentId }, { attendanceEvents: i.attendanceEvents })));

        // teacher not found
        const a1 = await lectures.getAttendance('ffffffffffffffffffffffff');
        
        fakeClock.returns(new Date('2019-12-25T16:00:00').getTime());

        // holiday
        const a2 = await lectures.getAttendance('5dca7e2b461dc52d681804f1');
        
        fakeClock.returns(new Date('2019-11-27T16:00:00').getTime());

        // teacher has no lecture today
        const a3 = await lectures.getAttendance('5dca7e2b461dc52d681804f2');
        // ok 1
        const a4 = await lectures.getAttendance('5dca7e2b461dc52d681804f1');

        fakeClock.returns(new Date('2019-11-15T08:01:00').getTime());
        // ok 2
        const a5 = await lectures.getAttendance('5dca7e2b461dc52d681804f2');

        fakeClock.restore();

        expect(a1.output.statusCode).to.equal(BAD_REQUEST);
        expect(a2.output.statusCode).to.equal(BAD_REQUEST);
        expect(a3.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(a4.attendance['5dc9c3112d698031f441e1c9'].sort((a, b) => b.id.toString() - a.id.toString())).to.equal(j(testData.students.filter(s => s.classId === '5dc9c3112d698031f441e1c9').map(s => {
            return { id: s._id, events: data.some(i => i.studentId === s._id) ? data.find(i => i.studentId === s._id).attendanceEvents.filter(ae => ae.date.isSameDayOf(new Date('2019-11-27T16:00:00'))) : [] };
        }).sort((a, b) => b.id - a.id)));
        jexpect(a5.attendance['5dc9c3112d698031f441e1c9'].sort((a, b) => b.id.toString() - a.id.toString())).to.equal(j(testData.students.filter(s => s.classId === '5dc9c3112d698031f441e1c9').map(s => {
            return { id: s._id, events: data.some(i => i.studentId === s._id) ? data.find(i => i.studentId === s._id).attendanceEvents.filter(ae => ae.date.isSameDayOf(new Date('2019-11-15T08:01:00'))) : [] };
        }).sort((a, b) => b.id - a.id)));
    });
    
    test('recordAssignments', async () => {
        const daysDelta = (new Date().addDays(14).weekStart().getTime() - new Date().weekStart().getTime()) / HLib.day;
        
        await Calendar.insertMany(testData.calendar);
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

        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-12-18T08:00:00').getTime());

        // holiday
        const a6 = await lectures.recordAssignments('5dca7e2b461dc52d681804f5', 'English', 'Some new assignments!', new Date('2019-12-25T10:00:00'));
        
        fakeClock.returns(new Date('2019-11-26T08:00:00').getTime());

        // due date is today
        const a7 = await lectures.recordAssignments('5dca7e2b461dc52d681804f5', 'English', 'Assignments description here', new Date('2019-11-26T09:00:00'));

        fakeClock.restore();

        const sc1 = await SchoolClass.findOne({ _id: '5dc9c3112d698031f441e1c9' });

        // ok
        const a8 = await lectures.recordAssignments('5dca7e2b461dc52d681804f5', 'English', 'New assignments!', HLib.weekhourToDate('1_2').addDays(daysDelta));

        const sc2 = await SchoolClass.findOne({ _id: '5dc9c3112d698031f441e1c9' });

        expect(a1.output.statusCode).to.equal(BAD_REQUEST);
        expect(a2.output.statusCode).to.equal(BAD_REQUEST);
        expect(a3.output.statusCode).to.equal(BAD_REQUEST);
        expect(a4.output.statusCode).to.equal(BAD_REQUEST);
        expect(a5.output.statusCode).to.equal(BAD_REQUEST);
        expect(a6.output.statusCode).to.equal(BAD_REQUEST);
        expect(a7.output.statusCode).to.equal(BAD_REQUEST);
        expect(sc1.assignments).to.have.length(0);
        expect(a8.success).to.be.true();
        expect(sc2.assignments).to.have.length(1);
        jexpect(sc2.assignments[0]).to.include(j({ subject: 'English', description: 'New assignments!', due: HLib.weekhourToDate('1_2').addDays(daysDelta) }));
    });
    
    test('addSupportMaterial', async () => {
        const fakeSaveFile = Sinon.stub(Utils, 'saveFiles');
        fakeSaveFile.onCall(0).resolves(['5dca7e2b461dc52c4a29be45']);
        fakeSaveFile.onCall(1).resolves(['5dca7e2b461dc52c4a29be46', '5dca7e2b461dc52c4a29be47']);

        await Teacher.insertMany(testData.teachers);
        await SchoolClass.insertMany(testData.classes);
        
        // teacher not found
        const sm1 = await lectures.addSupportMaterial('ffffffffffffffffffffffff', '5dc9c3112d698031f441e1c9', 'Science', 'Some support material.', null);
        // teacher does not teach to class
        const sm2 = await lectures.addSupportMaterial('5dca7e2b461dc52d681804f6', '5dc9cb4b797f6936680521b9', 'Science', 'Some support material.', null);
        // teacher does not teach this subject to class
        const sm3 = await lectures.addSupportMaterial('5dca7e2b461dc52d681804f6', '5dc9c3112d698031f441e1c9', 'Latin', 'Some support material.', null);

        const sc1 = await SchoolClass.findById('5dc9c3112d698031f441e1c9');

        // ok 1
        const sm4 = await lectures.addSupportMaterial('5dca7e2b461dc52d681804f6', '5dc9c3112d698031f441e1c9', 'Science', 'Periodic Table', 'fakeFile.txt');
        
        const sc2 = await SchoolClass.findById('5dc9c3112d698031f441e1c9');
        
        // ok 2
        const sm5 = await lectures.addSupportMaterial('5dca7e2b461dc52d681804f2', '5dc9c3112d698031f441e1c9', 'Math', 'Formulas', ['1.pdf', '2.pdf']);
        
        const sc3 = await SchoolClass.findById('5dc9c3112d698031f441e1c9');
        const newMaterial = sc3.supportMaterials.find(sm => !sc2.supportMaterials.some(sm2 => sm2._id.equals(sm._id)));
        
        expect(fakeSaveFile.callCount).to.equal(2);
        expect(fakeSaveFile.calledWithExactly(['fakeFile.txt'])).to.be.true();
        expect(fakeSaveFile.calledWithExactly(['1.pdf', '2.pdf'])).to.be.true();

        fakeSaveFile.restore();

        expect(sm1.output.statusCode).to.equal(BAD_REQUEST);
        expect(sm2.output.statusCode).to.equal(BAD_REQUEST);
        expect(sm3.output.statusCode).to.equal(BAD_REQUEST);
        expect(sc1.supportMaterials).to.have.length(0);
        expect(sm4.success).to.be.true();
        expect(sc2.supportMaterials).to.have.length(1);
        expect(Math.abs(sc2.supportMaterials[0].uploaded - new Date())).to.be.lessThan(1000);
        jexpect(sc2.supportMaterials[0]).to.include({ subject: 'Science', description: 'Periodic Table', attachments: ['5dca7e2b461dc52c4a29be45'] });
        expect(sm5.success).to.be.true();
        expect(Math.abs(newMaterial.uploaded - new Date())).to.be.lessThan(1000);
        jexpect(newMaterial).to.include({ subject: 'Math', description: 'Formulas', attachments: ['5dca7e2b461dc52c4a29be46', '5dca7e2b461dc52c4a29be47'] });
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
        
        await Calendar.insertMany(testData.calendar);
        await Student.insertMany(testData.students);
        await Teacher.insertMany(testData.teachers);

        // teacher not found
        const rc1 = await lectures.rollCall('ffffffffffffffffffffffff', data1);

        fakeClock.returns(new Date('2019-12-25T10:00:00').getTime());

        // holiday
        const rc2 = await lectures.rollCall('5dca7e2b461dc52d681804f1', data1);
        
        fakeClock.returns(new Date('2019-11-26T16:00:00').getTime());

        // teacher has no lecture on first hour today
        const rc3 = await lectures.rollCall('5dca7e2b461dc52d681804f6', data1);
        // students list not complete
        const rc4 = await lectures.rollCall('5dca7e2b461dc52d681804f1', [
            { studentId: '5dca711c89bf46419cf5d485', present: true },
            { studentId: '5dca711c89bf46419cf5d48b', present: false },
            { studentId: '5dca711c89bf46419cf5d48f', present: true },
        ]);
        // some students not belonging to considered class
        const rc5 = await lectures.rollCall('5dca7e2b461dc52d681804f1', [
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
        const rc6 = await lectures.rollCall('5dca7e2b461dc52d681804f1', data1);
        const st1 = await Student.find({ classId: '5dc9c3112d698031f441e1c9' }, { 'attendanceEvents._id': 0 });
        // ok (change)
        const rc7 = await lectures.rollCall('5dca7e2b461dc52d681804f1', data2);
        const st2 = await Student.find({ classId: '5dc9c3112d698031f441e1c9' }, { 'attendanceEvents._id': 0 });

        fakeClock.restore();

        expect(rc1.output.statusCode).to.equal(BAD_REQUEST);
        expect(rc2.output.statusCode).to.equal(BAD_REQUEST);
        expect(rc3.output.statusCode).to.equal(BAD_REQUEST);
        expect(rc4.output.statusCode).to.equal(BAD_REQUEST);
        expect(rc5.output.statusCode).to.equal(BAD_REQUEST);
        expect(rc6.success).to.be.true();
        data1.forEach(i => jexpect(st1.find(s => s._id.toString() === i.studentId).attendanceEvents).to.equal(j(i.present ? [] : [
            { date: new Date('2019-11-26T08:00:00'), event: 'absence' }
        ])));
        expect(rc7.success).to.be.true();
        data2.forEach(i => jexpect(st2.find(s => s._id.toString() === i.studentId).attendanceEvents).to.equal(j(i.present ? [] : [
            { date: new Date('2019-11-26T08:00:00'), event: 'absence' }
        ])));
    });

});