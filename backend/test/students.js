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