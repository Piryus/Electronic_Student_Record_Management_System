'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const Student = require('../models/Student');
const Parent = require('../models/Parent');
const SchoolClass = require ('../models/SchoolClass');

const students = require ('../routes/students/handlers');

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
    
    test('addStudent', async () => {
        const data = [
            { ssn: 'FCEEHG02B04N054D', name: 'Luca', surname: 'Longo' },
            { ssn: 'JLMLBH00B07K064G', name: 'Alessio', surname: 'Mazzi' },
            { ssn: 'MGOAAP05I08P020M', name: 'Enzo', surname: 'Cremonesi' },
            { ssn: 'IFHMHK01L07L058D', name: 'Giacomo', surname: 'Lori' },
            { ssn: 'PBFNDJ01E04O002B', name: 'Anna', surname: 'Bianchi' },
            { ssn: 'GPNCID08N09N089B', name: 'Riccardo', surname: 'Cocci' }
        ];

        const empty = await Student.find({});
        await Promise.all(data.map(s => students.addStudent(s.ssn, s.name, s.surname)));
        const full = await Student.find({});

        expect(empty).to.have.length(0);
        expect(full).to.have.length(6);
        data.forEach((s, i) => jexpect(full[i]).to.include(s));
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

    test('getAllStudents', async () => {
        await Student.insertMany(testData.students);
        const all = await students.getAllStudents();

        jexpect(all.students).to.equal(testData.students);
    });

    test('getAllClasses', async () => {
        await SchoolClass.insertMany(testData.classes);
        const all = await students.getAllClasses();

        jexpect(all.classes).to.equal(testData.classes);
    });

});