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
    
    test('getTeachers', async () => {
        await User.insertMany(testData.users);

        const t1 = await secretary.getTeachers();

        await Teacher.insertMany(testData.teachers);
        
        const t2 = await secretary.getTeachers();
        
        expect(t1.teachers).to.have.length(0);
        expect(t2.teachers).to.have.length(8);
        jexpect(t2.teachers).to.equal(j([
            { id: '5dca698eed550e4ca4aba7f5', ssn: 'DJRFUC56J13E485F', name: 'Mario', surname: 'Bianchi', mail: 'mario.bianchi@teacher.com' },
            { id: '5dca69cf048e8e40d434017f', ssn: 'CMFOLR29R45S203O', name: 'Roberta', surname: 'Verdi', mail: 'roberta.verdi@teacher.com' },
            { id: '5dca6cbe7adca3346c5983cb', ssn: 'LDFVUI17P04D491B', name: 'Stefano', surname: 'Rossi', mail: 'stefano.rossi@teacher.com' },
            { id: '5dca6cd5b83a1f3ef03e962b', ssn: 'SCBGMN21E45O956Q', name: 'Peter', surname: 'Posta', mail: 'peter.posta@teacher.com' },
            { id: '5dca6cf0a92bbb4dd8c0e817', ssn: 'PLVCGT02S19R549A', name: 'Federica', surname: 'Valli', mail: 'federica.valli@teacher.com' },
            { id: '5dca6d0801ea271794cb650e', ssn: 'LCFTUI58S49G910R', name: 'Cinzia', surname: 'Tollo', mail: 'cinzia.tollo@teacher.com' },
            { id: '5dca6d2038627d0bfc4167b0', ssn: 'QASVUM68G45D297P', name: 'Dario', surname: 'Resti', mail: 'dario.resti@teacher.com' },
            { id: '5dca6d3620607b1e30dea42a', ssn: 'NCFTOG69F23B796K', name: 'Nina', surname: 'Fassio', mail: 'nina.fassio@teacher.com' }
        ]));
    });
    
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
    
    test('getParents', async () => {
        await User.insertMany(testData.users);

        const p1 = await secretary.getParents();

        await User.updateOne({ _id: '5dca7e2b461dc52d681804fa' }, { firstLogin: true });
        await User.updateOne({ _id: '5dca7e2b461dc52d681804fd' }, { firstLogin: true });
        await User.updateOne({ _id: '5dca7e2b461dc52d681804fe' }, { firstLogin: true });

        const p2 = await secretary.getParents();

        expect(p1).to.have.length(0);
        expect(p2).to.have.length(3);
        jexpect(p2).to.equal(j([
            { _id: '5dca7e2b461dc52d681804fa', ssn: 'JFMCL00C02H025N', name: 'Tiziana', surname: 'Gentile', mail: 'tiziana.gentile@parent.com' },
            { _id: '5dca7e2b461dc52d681804fd', ssn: 'BCOAEN01B09O049L', name: 'Lucia', surname: 'Monge', mail: 'lucia.monge@parent.com' },
            { _id: '5dca7e2b461dc52d681804fe', ssn: 'GELOEN01E09P064N', name: 'Corrado', surname: 'Bianchi', mail: 'corrado.bianchi@parent.com' }
        ]));
    });
    
    test('updateTeacher', async () => {
        await Teacher.insertMany(testData.teachers);
        await User.insertMany(testData.users);

        // teacher not found
        const ut1 = await secretary.updateTeacher('ffffffffffffffffffffffff');

        const t1 = await Teacher.findById('5dca6cbe7adca3346c5983cb').populate('userId');
        
        // ok
        const ut2 = await secretary.updateTeacher('5dca6cbe7adca3346c5983cb', 'VHBTUR56B29R594T', 'Chanel', 'Binzi', 'chanel.binzi@teacher.com');
        
        const t2 = await Teacher.findById('5dca6cbe7adca3346c5983cb').populate('userId');

        expect(ut1.output.statusCode).to.equal(BAD_REQUEST);
        expect(t1.userId.ssn).to.equal('LDFVUI17P04D491B');
        expect(t1.userId.name).to.equal('Stefano');
        expect(t1.userId.surname).to.equal('Rossi');
        expect(t1.userId.mail).to.equal('stefano.rossi@teacher.com');
        expect(ut2.success).to.be.true();
        expect(t2.userId.ssn).to.equal('VHBTUR56B29R594T');
        expect(t2.userId.name).to.equal('Chanel');
        expect(t2.userId.surname).to.equal('Binzi');
        expect(t2.userId.mail).to.equal('chanel.binzi@teacher.com');
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

        expect(getRandomPassword.callCount).to.equal(1);
        expect(sendWelcomeEmail.callCount).to.equal(1);
        expect(sendWelcomeEmail.calledWithExactly('abbah.lucex@parent.com', 'Abbah Lucex', 'q34!.7tv4t78R%329n,w90w')).to.be.true();

        getRandomPassword.restore();
        sendWelcomeEmail.restore();
        
        expect(u1).to.be.null();
        jexpect(u2).to.include({ ssn: 'CMDFUR58H28D382T', name: 'Abbah', surname: 'Lucex', mail: 'abbah.lucex@parent.com', scope: ['parent'] });
        jexpect(p2).to.include({ userId: u2._id.toString(), children: ['5dca711c89bf46419cf5d490'] });
        
        expect(a1.output.statusCode).to.equal(BAD_REQUEST);
        expect(a2.output.statusCode).to.equal(BAD_REQUEST);
        expect(a3.success).to.be.true();
    });
    
    test('sendCredentials', async () => {
        const sendWelcomeEmail = Sinon.stub(Utils, 'sendWelcomeEmail');

        await Parent.insertMany(testData.parents);
        await User.insertMany(testData.users);

        const sc1 = await secretary.sendCredentials(['5dca7e2b461dc52d681804fb', '5dca7e2b461dc52d681804fa', '5dca7e2b461dc52d681804fc', '5dca7e2b461dc52d681804fe']);

        expect(sendWelcomeEmail.callCount).to.equal(4);
        expect(sendWelcomeEmail.calledWithExactly('barbara.galli@parent.com', 'Barbara Galli', 'parentB_1')).to.be.true();
        expect(sendWelcomeEmail.calledWithExactly('tiziana.gentile@parent.com', 'Tiziana Gentile', 'parentA_2')).to.be.true();
        expect(sendWelcomeEmail.calledWithExactly('fabio.cremonesi@parent.com', 'Fabio Cremonesi', 'parentB_2')).to.be.true();
        expect(sendWelcomeEmail.calledWithExactly('corrado.bianchi@parent.com', 'Corrado Bianchi', 'parentC_2')).to.be.true();

        sendWelcomeEmail.restore();

        expect(sc1.success).to.be.true();
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
        fakeParseTimetablesFile.onCall(0).returns(null);

        await SchoolClass.insertMany(testData.classes);
        await Teacher.insertMany(testData.teachers);
        await User.insertMany(testData.users);

        // parsing failed
        const pt1 = await secretary.publishTimetables('somefile');
        // ok
        const pt2 = await secretary.publishTimetables('somefile');

        const t1 = await Teacher.find();

        expect(fakeParseTimetablesFile.callCount).to.equal(2);

        fakeParseTimetablesFile.restore();
        
        expect(pt1.output.statusCode).to.equal(BAD_REQUEST);
        expect(pt2.success).to.be.true();
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