'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const File = require('../models/File');
const Parent = require('../models/Parent');
const SchoolClass = require ('../models/SchoolClass');
const Student = require('../models/Student');

const files = require ('../routes/files/handlers');

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

suite('files', () => {

    test('get', async () => {
        const h = { file: Sinon.stub().returns({ returnOk: true }) };

        await File.insertMany(testData.files);
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await SchoolClass.insertMany(testData.classes);

        await Parent.insertMany([
            { userId: '5dc9c3112d698031f8d5c3a1' },
            { userId: '5dc9c3112d698031f8d5c3a2', children: [] },
            { userId: '5dc9c3112d698031f8d5c3a3', children: ['ffffffffffffffffffffffff', '5dca711c89bf46419cf5d486'] }
        ]);
        await SchoolClass.update({ _id: '5dc9cb4b797f6936680521b9' }, { assignments: [
            { subject: 'Science', description: 'Bla', attachments: ['5dc9c3112d698031f882d0c9'] }
        ] });
        await SchoolClass.update({ _id: '5dc9c3112d698031f441e1c9' }, { assignments: [
            { subject: 'Italian', description: 'Divina Commedia', attachments: ['5dc9c3112d698031f882d0cb'] }
        ], supportMaterials: [
            { subject: 'Math', description: 'Formulas', attachments: ['5dc9c3112d698031f882d0ca', '5dc9c3112d698031f882d0cc'] }
        ] });
        
        // parent not found
        const g1 = await files.get(h, 'ffffffffffffffffffffffff', '5dc9c3112d698031f882d0c9');
        // parent with undefined children
        const g2 = await files.get(h, '5dc9c3112d698031f8d5c3a1', '5dc9c3112d698031f882d0c9');
        // parent with no children
        const g3 = await files.get(h, '5dc9c3112d698031f8d5c3a2', '5dc9c3112d698031f882d0c9');
        // parent with some nonexisting children
        const g4 = await files.get(h, '5dc9c3112d698031f8d5c3a3', '5dc9c3112d698031f882d0c9');
        // accessing nonexisting file
        const g5 = await files.get(h, '5dca7e2b461dc52d681804fb', 'ffffffffffffffffffffffff');
        // accessing file from another class
        const g6 = await files.get(h, '5dca7e2b461dc52d681804fb', '5dc9c3112d698031f882d0c9');

        // ok 1
        const g7 = await files.get(h, '5dca7e2b461dc52d681804fb', '5dc9c3112d698031f882d0cb');
        // ok 2
        const g8 = await files.get(h, '5dca7e2b461dc52d681804fb', '5dc9c3112d698031f882d0ca');
        // ok 3
        const g9 = await files.get(h, '5dca7e2b461dc52d681804fb', '5dc9c3112d698031f882d0cc');
        
        expect(g1.output.statusCode).to.equal(BAD_REQUEST);
        expect(g2.output.statusCode).to.equal(BAD_REQUEST);
        expect(g3.output.statusCode).to.equal(BAD_REQUEST);
        expect(g4.output.statusCode).to.equal(BAD_REQUEST);
        expect(g5.output.statusCode).to.equal(BAD_REQUEST);
        expect(g6.output.statusCode).to.equal(BAD_REQUEST);
        expect(g7.returnOk).to.be.true();
        expect(g8.returnOk).to.be.true();
        expect(g9.returnOk).to.be.true();
        expect(h.file.callCount).to.equal(3);
        expect(h.file.calledWithExactly('5dc9c3112d698031f882d0cb', { mode: 'attachment', filename: 'divina_commedia.txt' })).to.be.true();
        expect(h.file.calledWithExactly('5dc9c3112d698031f882d0ca', { mode: 'attachment', filename: 'math_formulas.pdf' })).to.be.true();
        expect(h.file.calledWithExactly('5dc9c3112d698031f882d0cc', { mode: 'attachment', filename: 'math_formulas_2.pdf' })).to.be.true();
    });

});