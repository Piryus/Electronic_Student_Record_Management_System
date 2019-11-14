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
        server = await require('../server')();
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
        parentFindOne.resolves({ children: ['5dca6cf0a92bbb4dd8c0e817'] });
        studentFindOne.resolves({ _id: '5dca6cf0a92bbb4dd8c0e817', grades });
        const options1 = {
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
        const res1 = await server.inject(options1);
        expect(parentFindOne.callCount).to.equal(1);
        expect(parentFindOne.calledWithExactly({ userId: '5dca711c89bf46419cf5d48d' })).to.be.true();
        expect(studentFindOne.callCount).to.equal(1);
        expect(studentFindOne.calledWithExactly({ _id: '5dca6cf0a92bbb4dd8c0e817' })).to.be.true();
        expect(res1.result.grades).to.equal(grades);
        parentFindOne.restore();
        studentFindOne.restore();
    });
    
});