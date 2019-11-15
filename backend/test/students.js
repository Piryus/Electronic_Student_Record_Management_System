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
        const auth = {
            strategy: 'session',
            credentials: {
                scope: 'parent',
                id: '5dca711c89bf46419cf5d48d'
            }
        };

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
            url: '/grades/zzzz',
            auth
        };
        // #3 - wrong parameters
        const res3 = await server.inject(options3);

        const options4 = {
            method: 'GET',
            url: '/grades/5dca6cf0a92bbb4dd8c0e817',
            auth
        };
        // #4 - parent not found
        const res4 = await server.inject(options4);
        // #5 - student not found
        const res5 = await server.inject(options4);
        // #6 - student is not child of parent
        const res6 = await server.inject(options4);
        // #7 - unknown error
        const res7 = await server.inject(options4);
        // #8 - success
        const res8 = await server.inject(options4);

        expect(res1.statusCode).to.equal(302);
        expect(res2.statusCode).to.equal(403);
        expect(res3.statusCode).to.equal(400);
        expect(res4.statusCode).to.equal(400);
        expect(res5.statusCode).to.equal(400);
        expect(res6.statusCode).to.equal(400);
        expect(res7.statusCode).to.equal(500);
        expect(res8.result.grades).to.equal(grades);

        expect(parentFindOne.callCount).to.equal(5);
        expect(parentFindOne.calledWithExactly({ userId: '5dca711c89bf46419cf5d48d' })).to.be.true();
        expect(studentFindOne.callCount).to.equal(5);
        expect(studentFindOne.calledWithExactly({ _id: '5dca6cf0a92bbb4dd8c0e817' })).to.be.true();

        parentFindOne.restore();
        studentFindOne.restore();

    });

    test('addStudent', async () =>{

        const auth = {
            strategy: 'session',
            credentials: {
                scope: 'officer',
                id: '5dca711c89bf46419cf5d48d'
            }
        };


        const studentSave = Sinon.stub(Student.prototype, 'save');

        studentSave.onCall(0).throws();
        studentSave.onCall(1).returns({success: true});


        const options1 = {
            method: 'POST',
            url: '/students'
        };

        // #1 - No authentication
        const res1 = await server.inject(options1);

        const options2 = {
            method: 'POST',
            url: '/students',
            auth: {
                strategy: 'session',
                credentials: {
                    scope: 'parent',
                    id: '5dca711c89bf46419cf5d48d'
                }
            }
        };

        // #2 - Inappropriate scope
        const res2 = await server.inject(options2);

        const options3 = {
            method: 'POST',
            url: '/students',
            auth
        };
        // #3 - No payload
        const res3 = await server.inject(options3);

        const options4 = {
            method: 'POST',
            url: '/students',
            auth,
            payload: {
                name: 'Giorgio',
                surname: 'Verdi'
            }
        };

        // #4 - No ssn in payload
        const res4 = await server.inject(options4);

        const options5 = {
            method: 'POST',
            url: '/students',
            auth,
            payload: {
                ssn: "GVSSN",
                surname: 'Verdi'
            }
        };

        // #5 - No name in payload
        const res5 = await server.inject(options5);

        const options6 = {
            method: 'POST',
            url: '/students',
            auth,
            payload: {
                ssn: "GVSSN",
                name: 'Giorgio'
            }
        };

        // #6 - No surname in payload
        const res6 = await server.inject(options6);


        const options7 = {
            method: 'POST',
            url: '/students',
            auth,
            payload: {
                ssn: "GVSSN",
                name: 'Giorgio',
                surname: 'Verdi'
            }
        };

        // #7 - Unknown error
        const res7 = await server.inject(options7);

        // #8 - Success scenario
        const res8 = await server.inject(options7);


        //Tests assertions
        expect(res1.statusCode).to.equal(302);
        expect(res2.statusCode).to.equal(403);
        expect(res3.statusCode).to.equal(400);
        expect(res4.statusCode).to.equal(400);
        expect(res5.statusCode).to.equal(400);
        expect(res6.statusCode).to.equal(400);
        expect(res7.statusCode).to.equal(500);
        expect(res8.result.success).to.be.true();

        expect(studentSave.callCount).to.equal(2);


    });
    
});