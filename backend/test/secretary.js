'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const HLib = require('@emarkk/hlib');

const Utils = require('../utils');

const Article = require('../models/Article');
const Parent = require('../models/Parent');
const SchoolClass = require('../models/SchoolClass');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

const secretary = require ('../routes/secretary/handlers');

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


suite('secretary', () => {
    
    test('getArticles', async () => {
        await User.insertMany(testData.users);

        const a1 = await secretary.getArticles();

        await Article.insertMany(testData.articles);
        
        const a2 = await secretary.getArticles();
        
        expect(a1.articles).to.have.length(0);
        expect(a2.articles).to.have.length(6);
        jexpect(a2.articles).to.equal(j(testData.articles.map(a => Object.assign({}, {
            _id: a._id,
            title: a.title,
            content: a.content,
            authorId: testData.users.some(u => u._id === a.authorId) ? {
                _id: a.authorId,
                name: testData.users.find(u => u._id === a.authorId).name,
                surname: testData.users.find(u => u._id === a.authorId).surname
            } : null,
            date: new Date(a.date),
            __v: a.__v
        })).sort((a, b) => b.date - a.date)));
    });
    
    test('addArticle', async () => {
        const data = [
            { authorId: '5dca7e2b461dc52d681804f4', title: 'Example title', content: 'Some very important information here.' },
            { authorId: '5dca7e2b461dc52d681804f9', title: 'Communications', content: 'Everything is going to be fine.' },
            { authorId: '5dca7e2b461dc52d681804fe', title: 'News feed', content: 'School will be closed for Christmas holidays.' },
            { authorId: '5dca7e2b461dc52d681804f3', title: 'Warning!', content: 'Check local media.' },
            { authorId: '5dca7e2b461dc52d681804f0', title: 'Read this carefully', content: 'Some more information here.' },
            { authorId: '5dca7e2b461dc52d681804f6', title: 'Not a title', content: 'This is a test.' },
        ];

        const empty = await Article.find({});
        await Promise.all(data.map(s => secretary.addArticle(s.authorId, s.title, s.content)));
        const full = await Article.find({});

        expect(empty).to.have.length(0);
        expect(full).to.have.length(6);
        data.forEach((s, i) => jexpect(full.sort((a, b) => a.authorId - b.authorId)[i]).to.include(s));
    });
    
    test('addParent', async () => {
        const getRandomPassword = Sinon.stub(HLib, 'getRandomPassword').returns('q34!.7tv4t78R%329n,w90w');
        const sendWelcomeEmail = Sinon.stub(Utils, 'sendWelcomeEmail');

        await Parent.insertMany(testData.parents);
        await Student.insertMany(testData.students);
        await User.insertMany(testData.users);

        // email address already exists
        const a1 = await secretary.addParent('CMDFUR58H28D382T', 'Abbah', 'Lucex', 'davide.capon@parent.com', 'FHCBUT23D54V786X');
        // student not found
        const a2 = await secretary.addParent('CMDFUR58H28D382T', 'Abbah', 'Lucex', 'abbah.lucex@parent.com', 'FHCBUT23D54V786X');

        const u1 = await User.findOne({ ssn: 'CMDFUR58H28D382T' });

        // ok
        const a3 = await secretary.addParent('CMDFUR58H28D382T', 'Abbah', 'Lucex', 'abbah.lucex@parent.com', 'GPNCID08N09N089B');

        const u2 = await User.findOne({ ssn: 'CMDFUR58H28D382T' });
        const p2 = await Parent.findOne({ userId: u2._id });

        expect(u1).to.be.null();
        jexpect(u2).to.include({ ssn: 'CMDFUR58H28D382T', name: 'Abbah', surname: 'Lucex', mail: 'abbah.lucex@parent.com', scope: ['parent'] });
        jexpect(p2).to.include({ userId: u2._id.toString(), children: ['5dca711c89bf46419cf5d490'] });
        
        expect(a1.output.statusCode).to.equal(BAD_REQUEST);
        expect(a2.output.statusCode).to.equal(BAD_REQUEST);
        expect(a3.success).to.be.true();

        expect(getRandomPassword.callCount).to.equal(1);
        expect(sendWelcomeEmail.callCount).to.equal(1);
        expect(sendWelcomeEmail.calledWithExactly('abbah.lucex@parent.com', 'Abbah Lucex', 'q34!.7tv4t78R%329n,w90w')).to.be.true();

        getRandomPassword.restore();
        sendWelcomeEmail.restore();
    });
    
    test('publishTimetables', async () => {
        const data = [
            { teacherId: '5dca6d2038627d0bfc4167b0', classId: '5dc9c3112d698031f441e1c9', subject: 'Gym', weekhour: '0_0' },
            { teacherId: '5dca6d2038627d0bfc4167b0', classId: '5dc9c3112d698031f441e1c9', subject: 'Gym', weekhour: '0_1' },
            { teacherId: '5dca69cf048e8e40d434017f', classId: '5dc9c3112d698031f441e1c9', subject: 'Physics', weekhour: '0_2' },
            { teacherId: '5dca698eed550e4ca4aba7f5', classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', weekhour: '0_3' },
            { teacherId: '5dca6cbe7adca3346c5983cb', classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', weekhour: '0_4' },
            { teacherId: '5dca6cd5b83a1f3ef03e962b', classId: '5dc9c3112d698031f441e1c9', subject: 'Art', weekhour: '1_0' },
            { teacherId: '5dca69cf048e8e40d434017f', classId: '5dc9c3112d698031f441e1c9', subject: 'Math', weekhour: '1_1' },
            { teacherId: '5dca698eed550e4ca4aba7f5', classId: '5dc9c3112d698031f441e1c9', subject: 'History', weekhour: '1_2' },
            { teacherId: '5dca6d3620607b1e30dea42a', classId: '5dc9c3112d698031f441e1c9', subject: 'Religion', weekhour: '1_3' },
            { teacherId: '5dca69cf048e8e40d434017f', classId: '5dc9c3112d698031f441e1c9', subject: 'Physics', weekhour: '1_4' },
            { teacherId: '5dca6cf0a92bbb4dd8c0e817', classId: '5dc9c3112d698031f441e1c9', subject: 'English', weekhour: '1_5' },
            { teacherId: '5dca6cbe7adca3346c5983cb', classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', weekhour: '2_0' },
            { teacherId: '5dca6cbe7adca3346c5983cb', classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', weekhour: '2_1' },
            { teacherId: '5dca698eed550e4ca4aba7f5', classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', weekhour: '2_2' },
            { teacherId: '5dca69cf048e8e40d434017f', classId: '5dc9c3112d698031f441e1c9', subject: 'Math', weekhour: '2_3' },
            { teacherId: '5dca6d0801ea271794cb650e', classId: '5dc9c3112d698031f441e1c9', subject: 'Science', weekhour: '2_4' },
            { teacherId: '5dca69cf048e8e40d434017f', classId: '5dc9c3112d698031f441e1c9', subject: 'Math', weekhour: '3_0' },
            { teacherId: '5dca69cf048e8e40d434017f', classId: '5dc9c3112d698031f441e1c9', subject: 'Math', weekhour: '3_1' },
            { teacherId: '5dca6cf0a92bbb4dd8c0e817', classId: '5dc9c3112d698031f441e1c9', subject: 'English', weekhour: '3_2' },
            { teacherId: '5dca698eed550e4ca4aba7f5', classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', weekhour: '3_3' },
            { teacherId: '5dca698eed550e4ca4aba7f5', classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', weekhour: '3_4' },
            { teacherId: '5dca6cf0a92bbb4dd8c0e817', classId: '5dc9c3112d698031f441e1c9', subject: 'English', weekhour: '4_0' },
            { teacherId: '5dca6cd5b83a1f3ef03e962b', classId: '5dc9c3112d698031f441e1c9', subject: 'Art', weekhour: '4_1' },
            { teacherId: '5dca6cbe7adca3346c5983cb', classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', weekhour: '4_2' },
            { teacherId: '5dca698eed550e4ca4aba7f5', classId: '5dc9c3112d698031f441e1c9', subject: 'History', weekhour: '4_3' },
            { teacherId: '5dca6d0801ea271794cb650e', classId: '5dc9c3112d698031f441e1c9', subject: 'Science', weekhour: '4_4' },
            { teacherId: '5dca69cf048e8e40d434017f', classId: '5dc9c3112d698031f441e1c9', subject: 'Math', weekhour: '4_5' },
        ];

        const timetable = (all, id) => all.find(t => t._id.equals(id)).timetable.map(w => {
            return { classId: w.classId, subject: w.subject, weekhour: w.weekhour };
        });
        const fakeParseTimetablesFile = Sinon.stub(HLib, 'parseTimetablesFile').returns(data);

        await SchoolClass.insertMany(testData.classes);
        await Teacher.insertMany(testData.teachers);
        await User.insertMany(testData.users);

        const pt1 = await secretary.publishTimetables('somefile');

        const t1 = await Teacher.find();

        expect(fakeParseTimetablesFile.callCount).to.equal(1);

        fakeParseTimetablesFile.restore();
        
        expect(pt1.success).to.be.true();
        jexpect(timetable(t1, '5dca698eed550e4ca4aba7f5')).to.equal([
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', weekhour: '0_3' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'History', weekhour: '1_2' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', weekhour: '2_2' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', weekhour: '3_3' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Italian', weekhour: '3_4' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'History', weekhour: '4_3' }
        ]);
        jexpect(timetable(t1, '5dca69cf048e8e40d434017f')).to.equal([
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Physics', weekhour: '0_2' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Math', weekhour: '1_1' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Physics', weekhour: '1_4' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Math', weekhour: '2_3' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Math', weekhour: '3_0' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Math', weekhour: '3_1' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Math', weekhour: '4_5' },
        ]);
        jexpect(timetable(t1, '5dca6cbe7adca3346c5983cb')).to.equal([
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', weekhour: '0_4' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', weekhour: '2_0' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', weekhour: '2_1' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Latin', weekhour: '4_2' }
        ]);
        jexpect(timetable(t1, '5dca6cd5b83a1f3ef03e962b')).to.equal([
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Art', weekhour: '1_0' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Art', weekhour: '4_1' }
        ]);
        jexpect(timetable(t1, '5dca6cf0a92bbb4dd8c0e817')).to.equal([
            { classId: '5dc9c3112d698031f441e1c9', subject: 'English', weekhour: '1_5' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'English', weekhour: '3_2' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'English', weekhour: '4_0' }
        ]);
        jexpect(timetable(t1, '5dca6d0801ea271794cb650e')).to.equal([
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Science', weekhour: '2_4' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Science', weekhour: '4_4' }
        ]);
        jexpect(timetable(t1, '5dca6d2038627d0bfc4167b0')).to.equal([
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Gym', weekhour: '0_0' },
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Gym', weekhour: '0_1' }
        ]);
        jexpect(timetable(t1, '5dca6d3620607b1e30dea42a')).to.equal([
            { classId: '5dc9c3112d698031f441e1c9', subject: 'Religion', weekhour: '1_3' }
        ]);
    });

});