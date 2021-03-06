'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const Calendar = require('../models/Calendar');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Teacher = require('../models/Teacher');
const SchoolClass = require ('../models/SchoolClass');
const User = require ('../models/User');

const students = require ('../routes/students/handlers');

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

suite('students', () => {

    test('getTeachers', async () => {
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await Teacher.insertMany(testData.teachers);
        await User.insertMany(testData.users);

        // parent not found
        const t1 = await students.getTeachers('ffffffffffffffffffffffff', '5dca711c89bf46419cf5d48e');
        // student not found
        const t2 = await students.getTeachers('5dca7e2b461dc52d681804fd', 'ffffffffffffffffffffffff');
        // student is not child of parent
        const t3 = await students.getTeachers('5dca7e2b461dc52d681804fd', '5dca711c89bf46419cf5d48f');
        // ok
        const t4 = await students.getTeachers('5dca7e2b461dc52d681804fd', '5dca711c89bf46419cf5d48e');
        
        expect(t1.output.statusCode).to.equal(BAD_REQUEST);
        expect(t2.output.statusCode).to.equal(BAD_REQUEST);
        expect(t3.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(t4.teachers).to.equal([
            { id: '5dca698eed550e4ca4aba7f5', ssn: 'DJRFUC56J13E485F', name: 'Mario', surname: 'Bianchi', subjects: ['Italian', 'History'] },
            { id: '5dca69cf048e8e40d434017f', ssn: 'CMFOLR29R45S203O', name: 'Roberta', surname: 'Verdi', subjects: ['Math', 'Physics'] },
            { id: '5dca6cbe7adca3346c5983cb', ssn: 'LDFVUI17P04D491B', name: 'Stefano', surname: 'Rossi', subjects: ['Latin'] },
            { id: '5dca6cd5b83a1f3ef03e962b', ssn: 'SCBGMN21E45O956Q', name: 'Peter', surname: 'Posta', subjects: ['Art'] },
            { id: '5dca6cf0a92bbb4dd8c0e817', ssn: 'PLVCGT02S19R549A', name: 'Federica', surname: 'Valli', subjects: ['English'] },
            { id: '5dca6d0801ea271794cb650e', ssn: 'LCFTUI58S49G910R', name: 'Cinzia', surname: 'Tollo', subjects: ['Science'] },
            { id: '5dca6d2038627d0bfc4167b0', ssn: 'QASVUM68G45D297P', name: 'Dario', surname: 'Resti', subjects: ['Gym'] },
            { id: '5dca6d3620607b1e30dea42a', ssn: 'NCFTOG69F23B796K', name: 'Nina', surname: 'Fassio', subjects: ['Religion'] },
        ]);
    });

    test('getGrades', async () => {
        await Calendar.insertMany(testData.calendar);
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await SchoolClass.insertMany(testData.classes);

        // parent not found
        const g1 = await students.getGrades('ffffffffffffffffffffffff', '5dca711c89bf46419cf5d489');
        // student not found
        const g2 = await students.getGrades('5dca7e2b461dc52d681804fb', 'ffffffffffffffffffffffff');
        // student is not child of parent
        const g3 = await students.getGrades('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d48f');

        await Student.updateOne({ _id: '5dca711c89bf46419cf5d489' }, { classId: undefined });

        // student has no class
        const g4 = await students.getGrades('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d489');

        await Student.updateOne({ _id: '5dca711c89bf46419cf5d489' }, { classId: '5dc9c3112d698031f441e1c9' });
        await SchoolClass.updateOne({ _id: '5dc9c3112d698031f441e1c9' }, { termsEndings: [new Date('2020-01-30T16:00:00'), new Date('2020-06-12T15:00:00')] });
        
        // both terms ended
        const g5 = await students.getGrades('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d489');
        
        await SchoolClass.updateOne({ _id: '5dc9c3112d698031f441e1c9' }, { termsEndings: [] });
        
        // ok 1
        const g6 = await students.getGrades('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d489');
        
        let s = await Student.findById('5dca711c89bf46419cf5d489');
        s.grades.push(
            { value: '6-', date: new Date('2019-11-14T09:00:00'), subject: 'History' },
            { value: '8.5', date: new Date('2019-12-07T11:00:00'), subject: 'Gym' },
            { value: '7', date: new Date('2020-01-31T12:00:00'), subject: 'Religion' },
            { value: '5 1/2', date: new Date('2020-03-10T12:00:00'), subject: 'Physics' },
            { value: '9+', date: new Date('2020-06-10T11:00:00'), subject: 'Science' }
        );
        await s.save();
        await SchoolClass.updateOne({ _id: '5dc9c3112d698031f441e1c9' }, { termsEndings: [new Date('2020-01-30T16:00:00')] });

        // ok 2
        const g7 = await students.getGrades('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d489');
        const g7sorted = g7.grades.sort((a, b) => b.date - a.date);
        
        expect(g1.output.statusCode).to.equal(BAD_REQUEST);
        expect(g2.output.statusCode).to.equal(BAD_REQUEST);
        expect(g3.output.statusCode).to.equal(BAD_REQUEST);
        expect(g4.output.statusCode).to.equal(BAD_REQUEST);
        expect(g5.grades).to.have.length(0);
        expect(g6.grades).to.have.length(1);
        expect(g6.grades[0].subject).to.equal('English');
        expect(g6.grades[0].value).to.equal('4.5');
        expect(g7.grades).to.have.length(3);
        expect(g7sorted[0].subject).to.equal('Science');
        expect(g7sorted[0].value).to.equal('9+');
        expect(g7sorted[1].subject).to.equal('Physics');
        expect(g7sorted[1].value).to.equal('5 1/2');
        expect(g7sorted[2].subject).to.equal('Religion');
        expect(g7sorted[2].value).to.equal('7');
    });

    test('getTermGrades', async () => {
        const data = [{
            'Latin': 5, 'English': 6, 'Art': 8, 'Science': 7, 'History': 10, 'Italian': 6, 'Math': 5, 'Physics': 5, 'Gym': 5, 'Religion': 5
        }];
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);

        // parent not found
        const tg1 = await students.getTermGrades('ffffffffffffffffffffffff', '5dca711c89bf46419cf5d491');
        // student not found
        const tg2 = await students.getTermGrades('5dca7e2b461dc52d681804fd', 'ffffffffffffffffffffffff');
        // student is not child of parent
        const tg3 = await students.getTermGrades('5dca7e2b461dc52d681804fd', '5dca711c89bf46419cf5d48f');

        // ok 1
        const tg4 = await students.getTermGrades('5dca7e2b461dc52d681804fd', '5dca711c89bf46419cf5d491');

        await Student.updateOne({ _id: '5dca711c89bf46419cf5d491' }, { termGrades: data });
        
        // ok 2
        const tg5 = await students.getTermGrades('5dca7e2b461dc52d681804fd', '5dca711c89bf46419cf5d491');
        
        expect(tg1.output.statusCode).to.equal(BAD_REQUEST);
        expect(tg2.output.statusCode).to.equal(BAD_REQUEST);
        expect(tg3.output.statusCode).to.equal(BAD_REQUEST);
        expect(tg4.termGrades).to.equal([]);
        jexpect(tg5.termGrades).to.equal(data);
    });
    
    test('getAttendance', async () => {
        const data = [
            { event: 'absence', date: new Date('2019-09-06T08:30:00') },
            { event: 'late-entry', date: new Date('2019-09-15T09:20:00') },
            { event: 'absence', date: new Date('2019-09-18T08:30:00') },
            { event: 'absence', date: new Date('2019-09-27T08:30:00') },
            { event: 'early-exit', date: new Date('2019-10-04T11:50:00') },
            { event: 'absence', date: new Date('2019-10-08T08:30:00') },
            { event: 'late-entry', date: new Date('2019-10-15T09:10:00') },
            { event: 'absence', date: new Date('2019-10-21T08:30:00') }
        ];

        await Parent.insertMany(testData.parents);
        await Student.insertMany(testData.students);
        await Student.updateOne({ _id: '5dca711c89bf46419cf5d489' }, { attendanceEvents: data });

        // parent not found
        const a1 = await students.getAttendance('ffffffffffffffffffffffff', '5dca711c89bf46419cf5d489');
        // student not found
        const a2 = await students.getAttendance('5dca7e2b461dc52d681804fb', 'ffffffffffffffffffffffff');
        // student is not child of parent
        const a3 = await students.getAttendance('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d48f');
        // ok
        const a4 = await students.getAttendance('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d489');

        expect(a1.output.statusCode).to.equal(BAD_REQUEST);
        expect(a2.output.statusCode).to.equal(BAD_REQUEST);
        expect(a3.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(a4.attendance).to.equal(j(data));
    });

    test('getNotes', async () => {
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await Teacher.insertMany(testData.teachers);
        await User.insertMany(testData.users);

        // parent not found
        const n1 = await students.getNotes('ffffffffffffffffffffffff', '5dca711c89bf46419cf5d489');
        // student not found
        const n2 = await students.getNotes('5dca7e2b461dc52d681804fb', 'ffffffffffffffffffffffff');
        // student is not child of parent
        const n3 = await students.getNotes('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d48f');

        // ok 1
        const n4 = await students.getNotes('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d489');
        
        await Student.updateOne({ _id: '5dca711c89bf46419cf5d489' }, { notes: [
            { _id: '5dca7e2bfcc5b52d681804f6', teacherId: '5dca698eed550e4ca4aba7f5', description: 'This is a first notice.', date: new Date('2019-11-10T10:06:04') },
            { _id: '5dca7e2bfcc5b52d681804f7', teacherId: '5dca6cd5b83a1f3ef03e962b', description: 'The situation is getting worse.', date: new Date('2019-11-18T11:02:19') }
        ] });
        
        // ok 2
        const n5 = await students.getNotes('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d489');
        
        expect(n1.output.statusCode).to.equal(BAD_REQUEST);
        expect(n2.output.statusCode).to.equal(BAD_REQUEST);
        expect(n3.output.statusCode).to.equal(BAD_REQUEST);
        expect(n4.notes).to.have.length(0);
        jexpect(n5.notes).to.have.equal(j([
            { _id: '5dca7e2bfcc5b52d681804f6', teacher: 'Mario Bianchi', description: 'This is a first notice.', date: new Date('2019-11-10T10:06:04') },
            { _id: '5dca7e2bfcc5b52d681804f7', teacher: 'Peter Posta', description: 'The situation is getting worse.', date: new Date('2019-11-18T11:02:19') }
        ]));
    });

    test('getStudents', async () => {
        const s1 = await students.getStudents(null);

        await Student.insertMany(testData.students);

        const s2 = await students.getStudents(null);
        const s3 = await students.getStudents('5dc9c3112d698031f441e1c9');
        const s4 = await students.getStudents('5dc9cb36ee91b7384cbd7fd7');
        const s5 = await students.getStudents('5dc9cb4b797f6936680521b9');

        expect(s1.students).to.have.length(0);
        expect(s2.students).to.have.length(15);
        jexpect(s2.students).to.equal(testData.students);
        expect(s3.students).to.have.length(11);
        jexpect(s3.students).to.equal(testData.students.filter(s => s.classId === '5dc9c3112d698031f441e1c9'));
        expect(s4.students).to.have.length(0);
        expect(s5.students).to.have.length(4);
        jexpect(s5.students).to.equal(testData.students.filter(s => s.classId === '5dc9cb4b797f6936680521b9'));
    });

    test('getClasses', async () => {
        await SchoolClass.insertMany(testData.classes);
        await Teacher.insertMany(testData.teachers);
        await User.insertMany(testData.users);
        const all = await students.getClasses();

        jexpect(all.classes).to.equal([
            { _id: '5dc9c3112d698031f441e1c9', name: '1A', timetable: [
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '0_1' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'History', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '1_0' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '1_1' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '2_0' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '2_1' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'History', teacher: { _id: '5dca698eed550e4ca4aba7f5', name: 'Mario', ssn: 'DJRFUC56J13E485F', surname: 'Bianchi' }, weekhour: '3_1' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Math', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '0_0' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Math', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '1_4' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Physics', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '1_5' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Math', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '3_2' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Math', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '3_3' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Physics', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '4_0' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Math', teacher: { _id: '5dca69cf048e8e40d434017f', name: 'Roberta', ssn: 'CMFOLR29R45S203O', surname: 'Verdi' }, weekhour: '4_4' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', teacher: { _id: '5dca6cbe7adca3346c5983cb', name: 'Stefano', ssn: 'LDFVUI17P04D491B', surname: 'Rossi' }, weekhour: '0_3' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', teacher: { _id: '5dca6cbe7adca3346c5983cb', name: 'Stefano', ssn: 'LDFVUI17P04D491B', surname: 'Rossi' }, weekhour: '0_4' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', teacher: { _id: '5dca6cbe7adca3346c5983cb', name: 'Stefano', ssn: 'LDFVUI17P04D491B', surname: 'Rossi' }, weekhour: '2_4' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', teacher: { _id: '5dca6cbe7adca3346c5983cb', name: 'Stefano', ssn: 'LDFVUI17P04D491B', surname: 'Rossi' }, weekhour: '4_2' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Art', teacher: { _id: '5dca6cd5b83a1f3ef03e962b', name: 'Peter', ssn: 'SCBGMN21E45O956Q', surname: 'Posta' }, weekhour: '0_2' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Art', teacher: { _id: '5dca6cd5b83a1f3ef03e962b', name: 'Peter', ssn: 'SCBGMN21E45O956Q', surname: 'Posta' }, weekhour: '4_5' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'English', teacher: { _id: '5dca6cf0a92bbb4dd8c0e817', name: 'Federica', ssn: 'PLVCGT02S19R549A', surname: 'Valli' }, weekhour: '1_2' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'English', teacher: { _id: '5dca6cf0a92bbb4dd8c0e817', name: 'Federica', ssn: 'PLVCGT02S19R549A', surname: 'Valli' }, weekhour: '2_2' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'English', teacher: { _id: '5dca6cf0a92bbb4dd8c0e817', name: 'Federica', ssn: 'PLVCGT02S19R549A', surname: 'Valli' }, weekhour: '3_0' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Science', teacher: { _id: '5dca6d0801ea271794cb650e', name: 'Cinzia', ssn: 'LCFTUI58S49G910R', surname: 'Tollo' }, weekhour: '2_3' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Science', teacher: { _id: '5dca6d0801ea271794cb650e', name: 'Cinzia', ssn: 'LCFTUI58S49G910R', surname: 'Tollo' }, weekhour: '4_3' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Gym', teacher: { _id: '5dca6d2038627d0bfc4167b0', name: 'Dario', ssn: 'QASVUM68G45D297P', surname: 'Resti' }, weekhour: '1_3' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Gym', teacher: { _id: '5dca6d2038627d0bfc4167b0', name: 'Dario', ssn: 'QASVUM68G45D297P', surname: 'Resti' }, weekhour: '4_1' },
                { classId: '5dc9c3112d698031f441e1c9', subject: 'Religion', teacher: { _id: '5dca6d3620607b1e30dea42a', name: 'Nina', ssn: 'NCFTOG69F23B796K', surname: 'Fassio' }, weekhour: '3_4' }
            ] },
            { _id: '5dc9cb36ee91b7384cbd7fd7', name: '1B', timetable: [] },
            { _id: '5dc9cb4b797f6936680521b9', name: '1C', timetable: [] }
        ]);
    });

    test('recordGrades', async () => {
        const data1 = [
            { studentId: '5dca711c89bf46419cf5d48e', grade: '5 and 1/2' },
            { studentId: '5dca711c89bf46419cf5d485', grade: '8+' },
            { studentId: '5dca711c89bf46419cf5d48c', grade: '10-' },
            { studentId: '5dca711c89bf46419cf5d487', grade: '6/7' }
        ];
        const data2 = [
            { studentId: '5dca711c89bf46419cf5d48f', grade: '7.75' }
        ];

        await Calendar.insertMany(testData.calendar);
        await Student.insertMany(testData.students);
        await Teacher.insertMany(testData.teachers);

        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-11-18T09:00:00').getTime());

        // teacher not found
        const g1 = await students.recordGrades('ffffffffffffffffffffffff', 'Latin', new Date(), 'Description', data1);
        // no student found
        const g2 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', new Date(), 'Description', [
            { studentId: 'aaaaaaaaaaaaaaaaaaaaaaaa', grade: '5+' },
            { studentId: 'bbbbbbbbbbbbbbbbbbbbbbbb', grade: '8.5' },
            { studentId: 'cccccccccccccccccccccccc', grade: '6 1/2' }
        ]);
        // only some students found
        const g3 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', new Date(), 'Description', [
            { studentId: 'aaaaaaaaaaaaaaaaaaaaaaaa', grade: '3.5' },
            { studentId: '5dca711c89bf46419cf5d489', grade: '9' },
            { studentId: 'bbbbbbbbbbbbbbbbbbbbbbbb', grade: '6+' },
            { studentId: '5dca711c89bf46419cf5d48f', grade: '10L' }
        ]);
        // students belong to multiple classes
        const g4 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', new Date(), 'Description', [
            { studentId: '5dca711c89bf46419cf5d485', grade: '3.5' },
            { studentId: '5dca711c89bf46419cf5d490', grade: '9' },
            { studentId: '5dca711c89bf46419cf5d483', grade: '6+' }
        ]);
        // teacher does not teach to class
        const g5 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', new Date(), 'Description', [
            { studentId: '5dca711c89bf46419cf5d490', grade: '7' }
        ]);
        // teacher does not teach subject
        const g6 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Math', new Date(), 'Description', data1);

        fakeClock.returns(new Date('2019-12-28T11:00:00').getTime());

        // attempt to record grades for holiday
        const g7 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', new Date('2019-11-25T12:00:00'), 'Description', data1);
        
        fakeClock.returns(new Date('2019-11-18T09:00:00').getTime());

        // attempt to record grades for future lecture
        const g8 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', new Date('2019-11-20T12:00:00'), 'Description', data1);
        
        fakeClock.returns(new Date('2019-11-23T09:00:00').getTime());

        // attempt to record grades for nonexisting lecture
        const g9 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', new Date('2019-11-19T09:00:00'), 'Description', data1);

        const s1 = await Student.find({});

        fakeClock.returns(new Date('2019-11-21T09:00:00').getTime());
        // ok 1
        const g10 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', new Date('2019-11-18T00:00:00'), 'First description', data1);
        
        const s2 = await Student.find({});

        fakeClock.returns(new Date('2019-11-22T11:00:00').getTime());
        // ok 2
        const g11 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', new Date('2019-11-20T08:00:00'), 'Written exam', data2);
        fakeClock.restore();
        
        const s3 = await Student.find({});
        
        expect(g1.output.statusCode).to.equal(BAD_REQUEST);
        expect(g2.output.statusCode).to.equal(BAD_REQUEST);
        expect(g3.output.statusCode).to.equal(BAD_REQUEST);
        expect(g4.output.statusCode).to.equal(BAD_REQUEST);
        expect(g5.output.statusCode).to.equal(BAD_REQUEST);
        expect(g6.output.statusCode).to.equal(BAD_REQUEST);
        expect(g7.output.statusCode).to.equal(BAD_REQUEST);
        expect(g8.output.statusCode).to.equal(BAD_REQUEST);
        expect(g9.output.statusCode).to.equal(BAD_REQUEST);
        data1.forEach((gr, i) =>
            expect(s1.find(s => s._id.toString() === gr.studentId).grades.some(g =>
                g.subject === 'Latin' && g.description === 'First description' && g.date.getTime() === new Date('2019-11-18T00:00:00').getTime() && g.value === gr.grade
            )).to.be.false()
        );
        data2.forEach((gr, i) =>
            expect(s1.find(s => s._id.toString() === gr.studentId).grades.some(g =>
                g.subject === 'Latin' && g.description === 'Written exam' && g.date.getTime() === new Date('2019-11-20T08:00:00').getTime() && g.value === gr.grade
            )).to.be.false()
        );
        expect(g10.success).to.be.true();
        data1.forEach((gr, i) =>
            expect(s2.find(s => s._id.toString() === gr.studentId).grades.some(g =>
                g.subject === 'Latin' && g.description === 'First description' && g.date.getTime() === new Date('2019-11-18T00:00:00').getTime() && g.value === gr.grade
            )).to.be.true()
        );
        data2.forEach((gr, i) =>
            expect(s2.find(s => s._id.toString() === gr.studentId).grades.some(g =>
                g.subject === 'Latin' && g.description === 'Written exam' && g.date.getTime() === new Date('2019-11-20T08:00:00').getTime() && g.value === gr.grade
            )).to.be.false()
        );
        expect(g11.success).to.be.true();
        data2.forEach((gr, i) =>
            expect(s3.find(s => s._id.toString() === gr.studentId).grades.some(g =>
                g.subject === 'Latin' && g.description === 'Written exam' && g.date.getTime() === new Date('2019-11-20T08:00:00').getTime() && g.value === gr.grade
            )).to.be.true()
        );
    });
    
    test('recordAttendance', async () => {
        const data1 = [
            { studentId: '5dca711c89bf46419cf5d48e', time: '08:07', attendanceEvent: 'late-entrance' },
            { studentId: '5dca711c89bf46419cf5d485', time: '08:09', attendanceEvent: 'late-entrance' }
        ];
        const data2 = [
            { studentId: '5dca711c89bf46419cf5d489', time: '08:06', attendanceEvent: 'late-entrance' },
            { studentId: '5dca711c89bf46419cf5d485', time: '08:06', attendanceEvent: 'late-entrance' }
        ];
        const data3 = [
            { studentId: '5dca711c89bf46419cf5d489', time: null, attendanceEvent: 'late-entrance' },
            { studentId: '5dca711c89bf46419cf5d484', time: '08:09', attendanceEvent: 'late-entrance' }
        ];

        await Calendar.insertMany(testData.calendar);
        await Student.insertMany(testData.students);
        await Teacher.insertMany(testData.teachers);

        // teacher not found
        const a1 = await students.recordAttendance('ffffffffffffffffffffffff', '5dc9c3112d698031f441e1c9', data1);
        // no student found
        const a2 = await students.recordAttendance('5dca7e2b461dc52d681804f3', '5dc9c3112d698031f441e1c9', [
            { studentId: 'aaaaaaaaaaaaaaaaaaaaaaaa', time: '08:04', attendanceEvent: 'late-entrance' },
            { studentId: 'bbbbbbbbbbbbbbbbbbbbbbbb', time: '08:06', attendanceEvent: 'late-entrance' },
            { studentId: 'cccccccccccccccccccccccc', time: '08:09', attendanceEvent: 'late-entrance' }
        ]);
        // only some students found
        const a3 = await students.recordAttendance('5dca7e2b461dc52d681804f3', '5dc9c3112d698031f441e1c9', [
            { studentId: 'aaaaaaaaaaaaaaaaaaaaaaaa', time: '08:05', attendanceEvent: 'late-entrance' },
            { studentId: '5dca711c89bf46419cf5d485', time: '08:05', attendanceEvent: 'late-entrance' },
            { studentId: 'bbbbbbbbbbbbbbbbbbbbbbbb', time: '08:07', attendanceEvent: 'late-entrance' },
            { studentId: '5dca711c89bf46419cf5d485', time: '08:08', attendanceEvent: 'late-entrance' }
        ]);
        // students belong to multiple classes
        const a4 = await students.recordAttendance('5dca7e2b461dc52d681804f3', '5dc9c3112d698031f441e1c9', [
            { studentId: '5dca711c89bf46419cf5d485', time: '08:05', attendanceEvent: 'late-entrance' },
            { studentId: '5dca711c89bf46419cf5d490', time: '08:05', attendanceEvent: 'late-entrance' },
            { studentId: '5dca711c89bf46419cf5d483', time: '08:07', attendanceEvent: 'late-entrance' }
        ]);

        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-12-26T08:00:00').getTime());

        // holiday
        const a5 = await students.recordAttendance('5dca7e2b461dc52d681804f5', '5dc9c3112d698031f441e1c9', data1);

        fakeClock.returns(new Date('2019-11-28T08:00:00').getTime());

        // teacher does not teach to class
        const a6 = await students.recordAttendance('5dca7e2b461dc52d681804f5', '5dc9cb4b797f6936680521b9', [
            { studentId: '5dca711c89bf46419cf5d48a', time: '08:05', attendanceEvent: 'late-entrance' }
        ]);
        // wrong time 1
        const a7 = await students.recordAttendance('5dca7e2b461dc52d681804f5', '5dc9cb4b797f6936680521b9', [
            { studentId: '5dca711c89bf46419cf5d48a', time: '10:50', attendanceEvent: 'late-entrance' }
        ]);
        // wrong time 2
        const a8 = await students.recordAttendance('5dca7e2b461dc52d681804f5', '5dc9c3112d698031f441e1c9', [
            { studentId: '5dca711c89bf46419cf5d48e', time: '08:40', attendanceEvent: 'late-entrance' }
        ]);
        const s1 = await Student.find();
        // ok 1 (insert)
        const a9 = await students.recordAttendance('5dca7e2b461dc52d681804f5', '5dc9c3112d698031f441e1c9', data1);
        const s2 = await Student.find();
        // ok 2 (update)
        const a10 = await students.recordAttendance('5dca7e2b461dc52d681804f5', '5dc9c3112d698031f441e1c9', data2);
        const s3 = await Student.find();
        // ok 3 (delete)
        const a11 = await students.recordAttendance('5dca7e2b461dc52d681804f5', '5dc9c3112d698031f441e1c9', data3);
        const s4 = await Student.find();

        fakeClock.restore();

        expect(a1.output.statusCode).to.equal(BAD_REQUEST);
        expect(a2.output.statusCode).to.equal(BAD_REQUEST);
        expect(a3.output.statusCode).to.equal(BAD_REQUEST);
        expect(a4.output.statusCode).to.equal(BAD_REQUEST);
        expect(a5.output.statusCode).to.equal(BAD_REQUEST);
        expect(a6.output.statusCode).to.equal(BAD_REQUEST);
        expect(a7.output.statusCode).to.equal(BAD_REQUEST);
        expect(a8.output.statusCode).to.equal(BAD_REQUEST);
        expect(s1.filter(s => ['5dca711c89bf46419cf5d484', '5dca711c89bf46419cf5d485', '5dca711c89bf46419cf5d489', '5dca711c89bf46419cf5d48e'].includes(s._id.toString())).flatMap(s => s.attendanceEvents)).to.have.length(0);
        expect(a9.success).to.be.true();
        expect(s2.find(s => '5dca711c89bf46419cf5d48e' === s._id.toString()).attendanceEvents).to.have.length(1);
        jexpect(s2.find(s => '5dca711c89bf46419cf5d48e' === s._id.toString()).attendanceEvents[0]).to.include(j({ date: new Date('2019-11-28T08:07:00'), event: 'late-entrance' }));
        expect(s2.find(s => '5dca711c89bf46419cf5d485' === s._id.toString()).attendanceEvents).to.have.length(1);
        jexpect(s2.find(s => '5dca711c89bf46419cf5d485' === s._id.toString()).attendanceEvents[0]).to.include(j({ date: new Date('2019-11-28T08:09:00'), event: 'late-entrance' }));
        expect(a10.success).to.be.true();
        expect(s3.find(s => '5dca711c89bf46419cf5d489' === s._id.toString()).attendanceEvents).to.have.length(1);
        jexpect(s3.find(s => '5dca711c89bf46419cf5d489' === s._id.toString()).attendanceEvents[0]).to.include(j({ date: new Date('2019-11-28T08:06:00'), event: 'late-entrance' }));
        expect(s3.find(s => '5dca711c89bf46419cf5d485' === s._id.toString()).attendanceEvents).to.have.length(1);
        jexpect(s3.find(s => '5dca711c89bf46419cf5d485' === s._id.toString()).attendanceEvents[0]).to.include(j({ date: new Date('2019-11-28T08:06:00'), event: 'late-entrance' }));
        expect(a11.success).to.be.true();
        expect(s4.find(s => '5dca711c89bf46419cf5d489' === s._id.toString()).attendanceEvents).to.have.length(0);
        expect(s4.find(s => '5dca711c89bf46419cf5d484' === s._id.toString()).attendanceEvents).to.have.length(1);
        jexpect(s4.find(s => '5dca711c89bf46419cf5d484' === s._id.toString()).attendanceEvents[0]).to.include(j({ date: new Date('2019-11-28T08:09:00'), event: 'late-entrance' }));
    });
    
    test('recordNotes', async () => {
        await Student.insertMany(testData.students);
        await Teacher.insertMany(testData.teachers);
        
        // teacher not found
        const n1 = await students.recordNote('ffffffffffffffffffffffff', '5dca711c89bf46419cf5d48c', 'Some description here.');
        // student not found
        const n2 = await students.recordNote('5dca7e2b461dc52d681804f5', 'ffffffffffffffffffffffff', 'Some description here.');

        const s1 = await Student.findById('5dca711c89bf46419cf5d48c');
        
        // ok
        const n3 = await students.recordNote('5dca7e2b461dc52d681804f5', '5dca711c89bf46419cf5d48c', 'A note for this bad student!');
        
        const s2 = await Student.findById('5dca711c89bf46419cf5d48c');

        expect(n1.output.statusCode).to.equal(BAD_REQUEST);
        expect(n2.output.statusCode).to.equal(BAD_REQUEST);
        expect(s1.notes).to.have.length(0);
        expect(n3.success).to.be.true();
        expect(s2.notes).to.have.length(1);
        jexpect(s2.notes[0]).to.include({ description: 'A note for this bad student!' });
    });
    
    test('addStudent', async () => {
        const data = [
            { ssn: 'FCEEHG02B04N054D', name: 'Luca', surname: 'Longo' },
            { ssn: 'GPNCID08N09N089B', name: 'Riccardo', surname: 'Cocci' },
            { ssn: 'IFHMHK01L07L058D', name: 'Giacomo', surname: 'Lori' },
            { ssn: 'JLMLBH00B07K064G', name: 'Alessio', surname: 'Mazzi' },
            { ssn: 'MGOAAP05I08P020M', name: 'Enzo', surname: 'Cremonesi' },
            { ssn: 'PBFNDJ01E04O002B', name: 'Anna', surname: 'Bianchi' }
        ];

        const empty = await Student.find({});
        await Promise.all(data.map(s => students.addStudent(s.ssn, s.name, s.surname)));
        const full = await Student.find({});

        const fs = full.sort((a, b) => a.ssn - b.ssn);

        expect(empty).to.have.length(0);
        expect(full).to.have.length(6);
        for(let i = 0; i < data.length; i++)
            jexpect(fs[i]).to.include(data[i]);
    });

    test('addSchoolClass', async () => {
        await Student.insertMany(testData.students);
        await SchoolClass.insertMany(testData.classes);

        const c1 = await Student.find({ classId: '5dc9c3112d698031f441e1c9' });
        const c2 = await Student.find({ classId: '5dc9cb36ee91b7384cbd7fd7' });
        const c3 = await Student.find({ classId: '5dc9cb4b797f6936680521b9' });
        const sc1 = await SchoolClass.findOne({ name: '2B' });
        await students.addSchoolClass('2B', ['5dca711c89bf46419cf5d488', '5dca711c89bf46419cf5d48d', '5dca711c89bf46419cf5d490', '5dca711c89bf46419cf5d484']);
        await students.addSchoolClass('1A', ['5dca711c89bf46419cf5d486', '5dca711c89bf46419cf5d48b', '5dca711c89bf46419cf5d491', '5dca711c89bf46419cf5d48e', '5dca711c89bf46419cf5d48d']);
        const c4 = await Student.find({ classId: '5dc9c3112d698031f441e1c9' });
        const sc2 = await SchoolClass.findOne({ name: '2B' });
        await students.addSchoolClass('1C', ['5dca711c89bf46419cf5d483', '5dca711c89bf46419cf5d487', '5dca711c89bf46419cf5d48a', '5dca711c89bf46419cf5d48f', '5dca711c89bf46419cf5d489']);
        const c5 = await Student.find({ classId: sc2._id });
        const c6 = await Student.find({ classId: '5dc9cb4b797f6936680521b9' });
        const c7 = await Student.find({ classId: undefined });

        expect(c1).to.have.length(11);
        expect(c2).to.have.length(0);
        expect(c3).to.have.length(4);
        expect(sc1).to.be.null();
        expect(c4).to.have.length(5);
        expect(c4.map(s => s.ssn)).to.only.include(['JLMLBH00B07K064G', 'OJCHFE07F05M064L', 'EOANEJ00J04K037K', 'PBFNDJ01E04O002B', 'KDKNJL01L05F034A']);
        expect(sc2.name).to.equal('2B');
        expect(c5).to.have.length(3);
        expect(c5.map(s => s.ssn)).to.only.include(['LMNNML01B05F051C', 'GPNCID08N09N089B', 'FCEEHG02B04N054D']);
        expect(c6).to.have.length(5);
        expect(c6.map(s => s.ssn)).to.only.include(['MDFGKO06L02F082G', 'CCJNJM09K01P046D', 'NAMAKH06I03P070A', 'AKFKCL03M05K075K', 'MGOAAP05I08P020M']);
        expect(c7).to.have.length(2);
        expect(c7.map(s => s.ssn)).to.only.include(['JPCOME07O02C034H', 'IFHMHK01L07L058D']);
    });

});