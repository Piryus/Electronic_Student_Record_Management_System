'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const Student = require('../models/Student');
const Parent = require('../models/Parent');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;
const before = lab.before;

let server;

before(async () => {
    try {
        server = await require('../server')(false);
        await server.initialize();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
});


suite('students', () => {
    
    test('getGrades', async () => {

        const grades = [
            { value: 5.0, subject: 'Math' },
            { value: 8.25, subject: 'English' },
            { value: 6.5, subject: 'History' },
            { value: 7, subject: 'Gym' },
        ];

        const parentFindOne = Sinon.stub(Parent, 'findOne');
        const studentFindOne = Sinon.stub(Student, 'findOne');

        parentFindOne.onCall(0).resolves(null);
        parentFindOne.onCall(2).resolves({ children: ['eeeeeeeeeeeeeeeeeeeeeeee'] });
        parentFindOne.resolves({ children: ['5dca6cf0a92bbb4dd8c0e817'] });
        
        studentFindOne.onCall(1).resolves(null);
        studentFindOne.onCall(3).throws();
        studentFindOne.resolves({ _id: '5dca6cf0a92bbb4dd8c0e817', grades });

        const options1 = {
            method: 'GET',
            url: '/grades/5dca6cf0a92bbb4dd8c0e817'
        };
        // #1 - no auth
        const res1 = await server.inject(options1);

        const options2 = {
            method: 'GET',
            url: '/grades/5dca6cf0a92bbb4dd8c0e817',
            auth: {
                strategy: 'session',
                credentials: {
                    scope: 'teacher',
                    id: '5dca711c89bf46419cf5d48d'
                }
            }
        };
        // #2 - inappropriate scope
        const res2 = await server.inject(options2);

        const options3 = {
            method: 'GET',
            url: '/grades/5dca6cf0a92bbb4dd8c0e817',
            auth: {
                strategy: 'session',
                credentials: {
                    scope: 'parent',
                    id: '5dca711c89bf46419cf5d48d'
                }
            }
        };
        // #3 - parent not found
        const res3 = await server.inject(options3);
        // #4 - student not found
        const res4 = await server.inject(options3);
        // #5 - student is not child of parent
        const res5 = await server.inject(options3);
        // #6 - unknown error
        const res6 = await server.inject(options3);
        // #7 - success
        const res7 = await server.inject(options3);

        expect(res1.statusCode).to.equal(302);
        expect(res2.statusCode).to.equal(403);
        expect(res3.statusCode).to.equal(400);
        expect(res4.statusCode).to.equal(400);
        expect(res5.statusCode).to.equal(400);
        expect(res6.statusCode).to.equal(500);
        expect(res7.result.grades).to.equal(grades);

        expect(parentFindOne.callCount).to.equal(5);
        expect(parentFindOne.calledWithExactly({ userId: '5dca711c89bf46419cf5d48d' })).to.be.true();
        expect(studentFindOne.callCount).to.equal(5);
        expect(studentFindOne.calledWithExactly({ _id: '5dca6cf0a92bbb4dd8c0e817' })).to.be.true();

        parentFindOne.restore();
        studentFindOne.restore();

    });
    
});