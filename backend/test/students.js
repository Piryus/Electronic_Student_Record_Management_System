'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Teacher = require('../models/Teacher');
const SchoolClass = require ('../models/SchoolClass');

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

    test('getGrades', async () => {
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);

        // parent not found
        const g1 = await students.getGrades('ffffffffffffffffffffffff', '5dca711c89bf46419cf5d489');
        // student not found
        const g2 = await students.getGrades('5dca7e2b461dc52d681804fb', 'ffffffffffffffffffffffff');
        // student is not child of parent
        const g3 = await students.getGrades('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d48f');
        // ok
        const g4 = await students.getGrades('5dca7e2b461dc52d681804fb', '5dca711c89bf46419cf5d489');
        
        expect(g1.output.statusCode).to.equal(BAD_REQUEST);
        expect(g2.output.statusCode).to.equal(BAD_REQUEST);
        expect(g3.output.statusCode).to.equal(BAD_REQUEST);
        jexpect(g4.grades).to.equal(testData.students.find(s => s._id === '5dca711c89bf46419cf5d489').grades);
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

    test('getStudents', async () => {
        const s1 = await students.getStudents(null);

        await Student.insertMany(testData.students);

        const s2 = await students.getStudents(null);

        expect(s1.students).to.have.length(0);
        expect(s2.students).to.have.length(15);
        jexpect(s2.students).to.equal(testData.students);
    });

    test('getClasses', async () => {
        await SchoolClass.insertMany(testData.classes);
        const all = await students.getClasses();

        jexpect(all.classes).to.equal(testData.classes);
    });

    test('recordGrades', async () => {
        const data1 = [
            { studentId: '5dca711c89bf46419cf5d48a', grade: '5 and 1/2' },
            { studentId: '5dca711c89bf46419cf5d490', grade: '8+' },
            { studentId: '5dca711c89bf46419cf5d48c', grade: '10-' },
            { studentId: '5dca711c89bf46419cf5d487', grade: '6/7' }
        ];
        const data2 = [
            { studentId: '5dca711c89bf46419cf5d48f', grade: '7.75' }
        ];

        await Student.insertMany(testData.students);
        await Teacher.insertMany(testData.teachers);
        await students.addSchoolClass('2A', ['5dca711c89bf46419cf5d489']);

        // teacher not found
        const g1 = await students.recordGrades('ffffffffffffffffffffffff', 'Latin', data1);
        // no student found
        const g2 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', [
            { studentId: 'aaaaaaaaaaaaaaaaaaaaaaaa', grade: '5+' },
            { studentId: 'bbbbbbbbbbbbbbbbbbbbbbbb', grade: '8.5' },
            { studentId: 'cccccccccccccccccccccccc', grade: '6 1/2' }
        ]);
        // only some students found
        const g3 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', [
            { studentId: 'aaaaaaaaaaaaaaaaaaaaaaaa', grade: '3.5' },
            { studentId: '5dca711c89bf46419cf5d489', grade: '9' },
            { studentId: 'bbbbbbbbbbbbbbbbbbbbbbbb', grade: '6+' },
            { studentId: '5dca711c89bf46419cf5d48f', grade: '10L' }
        ]);
        // students belong to multiple classes
        const g4 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', [
            { studentId: '5dca711c89bf46419cf5d485', grade: '3.5' },
            { studentId: '5dca711c89bf46419cf5d489', grade: '9' },
            { studentId: '5dca711c89bf46419cf5d483', grade: '6+' }
        ]);
        // teacher does not teach to class
        const g5 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', [{ studentId: '5dca711c89bf46419cf5d489', grade: '7' }]);
        // teacher does not teach subject
        const g6 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Math', data1);

        const fakeClock = Sinon.stub(Date, 'now').returns(new Date('2019-11-18T09:00:00').getTime());
        // attempt to record grades for future lecture
        const g7 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', data1);

        const s1 = await Student.find({});

        fakeClock.returns(new Date('2019-11-21T09:00:00').getTime());
        // ok 1
        const g8 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', data1);
        
        const s2 = await Student.find({});

        fakeClock.returns(new Date('2019-11-22T11:00:00').getTime());
        // ok 2
        const g9 = await students.recordGrades('5dca7e2b461dc52d681804f3', 'Latin', data2);
        fakeClock.restore();
        
        const s3 = await Student.find({});
        
        expect(g1.output.statusCode).to.equal(BAD_REQUEST);
        expect(g2.output.statusCode).to.equal(BAD_REQUEST);
        expect(g3.output.statusCode).to.equal(BAD_REQUEST);
        expect(g4.output.statusCode).to.equal(BAD_REQUEST);
        expect(g5.output.statusCode).to.equal(BAD_REQUEST);
        expect(g6.output.statusCode).to.equal(BAD_REQUEST);
        expect(g7.output.statusCode).to.equal(BAD_REQUEST);
        data1.forEach((gr, i) => expect(s1.find(s => s._id.toString() === gr.studentId).grades.some(g => g.subject === 'Latin' && g.value === gr.grade)).to.be.false());
        data2.forEach((gr, i) => expect(s1.find(s => s._id.toString() === gr.studentId).grades.some(g => g.subject === 'Latin' && g.value === gr.grade)).to.be.false());
        expect(g8.success).to.be.true();
        data1.forEach((gr, i) => expect(s2.find(s => s._id.toString() === gr.studentId).grades.some(g => g.subject === 'Latin' && g.value === gr.grade)).to.be.true());
        data2.forEach((gr, i) => expect(s2.find(s => s._id.toString() === gr.studentId).grades.some(g => g.subject === 'Latin' && g.value === gr.grade)).to.be.false());
        expect(g9.success).to.be.true();
        data2.forEach((gr, i) => expect(s3.find(s => s._id.toString() === gr.studentId).grades.some(g => g.subject === 'Latin' && g.value === gr.grade)).to.be.true());
    });
    
    test('addStudent', async () => {
        const data = [
            { ssn: 'PBFNDJ01E04O002B', name: 'Anna', surname: 'Bianchi' },
            { ssn: 'GPNCID08N09N089B', name: 'Riccardo', surname: 'Cocci' },
            { ssn: 'MGOAAP05I08P020M', name: 'Enzo', surname: 'Cremonesi' },
            { ssn: 'FCEEHG02B04N054D', name: 'Luca', surname: 'Longo' },
            { ssn: 'IFHMHK01L07L058D', name: 'Giacomo', surname: 'Lori' },
            { ssn: 'JLMLBH00B07K064G', name: 'Alessio', surname: 'Mazzi' }
        ];

        const empty = await Student.find({});
        await Promise.all(data.map(s => students.addStudent(s.ssn, s.name, s.surname)));
        const full = await Student.find({});

        expect(empty).to.have.length(0);
        expect(full).to.have.length(6);
        data.forEach((s, i) => jexpect(full.sort((a, b) => a.surname - b.surname)[i]).to.include(s));
    });

    test('addSchoolClass', async () => {
        await Student.insertMany(testData.students);
        await SchoolClass.insertMany(testData.classes);

        const c1 = await Student.find({ classId: '5dc9c3112d698031f441e1c9' });
        const c2 = await Student.find({ classId: '5dc9cb36ee91b7384cbd7fd7' });
        const c3 = await Student.find({ classId: '5dc9cb4b797f6936680521b9' });
        await students.addSchoolClass('2B', ['5dca711c89bf46419cf5d488', '5dca711c89bf46419cf5d48d', '5dca711c89bf46419cf5d490', '5dca711c89bf46419cf5d484']);
        await students.addSchoolClass('1A', ['5dca711c89bf46419cf5d486', '5dca711c89bf46419cf5d48b', '5dca711c89bf46419cf5d491', '5dca711c89bf46419cf5d48e', '5dca711c89bf46419cf5d48d']);
        const c4 = await Student.find({ classId: '5dc9c3112d698031f441e1c9' });
        const sc = await SchoolClass.findOne({ name: '2B' });
        await students.addSchoolClass('1C', ['5dca711c89bf46419cf5d483', '5dca711c89bf46419cf5d487', '5dca711c89bf46419cf5d48a', '5dca711c89bf46419cf5d48f', '5dca711c89bf46419cf5d489']);
        const c5 = await Student.find({ classId: sc._id });
        const c6 = await Student.find({ classId: '5dc9cb4b797f6936680521b9' });
        const c7 = await Student.find({ classId: undefined });

        expect(c1).to.have.length(15);
        expect(c2).to.have.length(0);
        expect(c3).to.have.length(0);
        expect(c4).to.have.length(5);
        expect(c4.map(s => s.ssn)).to.only.include(['JLMLBH00B07K064G', 'OJCHFE07F05M064L', 'EOANEJ00J04K037K', 'PBFNDJ01E04O002B', 'KDKNJL01L05F034A']);
        expect(c5).to.have.length(3);
        expect(c5.map(s => s.ssn)).to.only.include(['LMNNML01B05F051C', 'GPNCID08N09N089B', 'FCEEHG02B04N054D']);
        expect(c6).to.have.length(5);
        expect(c6.map(s => s.ssn)).to.only.include(['MDFGKO06L02F082G', 'CCJNJM09K01P046D', 'NAMAKH06I03P070A', 'AKFKCL03M05K075K', 'MGOAAP05I08P020M']);
        expect(c7).to.have.length(2);
        expect(c7.map(s => s.ssn)).to.only.include(['JPCOME07O02C034H', 'IFHMHK01L07L058D']);
    });

});