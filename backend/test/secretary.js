'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const HLib = require('hlib');

const Utils = require('../utils');

const Article = require('../models/Article');
const Parent = require('../models/Parent');
const Student = require('../models/Student');
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

});