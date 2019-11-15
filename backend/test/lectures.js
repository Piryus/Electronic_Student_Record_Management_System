'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const Utils = require('../utils');
const Lecture = require('../models/Lecture');
const Teacher = require('../models/Teacher');

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


suite('lectures', () => {
    
    test('recordDailyLectureTopics', async () => {
        
        const now = new Date();
        const ws = now.weekStart();
        const future = new Date().setTime(now.getTime() + 2 * Utils.day);
        const beforeWeekStart = new Date().setTime(ws.getTime() - 3 * Utils.day);

        const auth = {
            strategy: 'session',
            credentials: {
                scope: 'teacher',
                id: '6dc7a207b74c6e7109ba53cd'
            }
        };

        const teacherFindOne = Sinon.stub(Teacher, 'findOne');
        const utilsDateToWeekhour = Sinon.stub(Utils, 'dateToWeekhour');

        teacherFindOne.onCall(0).resolves(null);
        teacherFindOne.resolves({ });

        utilsDateToWeekhour.onCall(1).returns(null);
        utilsDateToWeekhour.returns('2_4');

        const options1 = {
            method: 'POST',
            url: '/lectures'
        };
        // #1 - no auth
        const res1 = await server.inject(options1);

        const options2 = {
            method: 'POST',
            url: '/lectures',
            auth: {
                strategy: 'session',
                credentials: {
                    scope: 'parent',
                    id: '5dca711c89bf46419cf5d48d'
                }
            }
        };
        // #2 - inappropriate scope
        const res2 = await server.inject(options2);

        const options3 = {
            method: 'POST',
            url: '/lectures',
            payload: {
                classId: 'zzzz',
                datetime: new Date('2019-11-10T12:40:00'),
                topics: 'some long description'
            },
            auth
        };
        // #3 - wrong classId
        const res3 = await server.inject(options3);

        const options4 = {
            method: 'POST',
            url: '/lectures',
            payload: {
                classId: 'd894ca1038f854aa19b73de4',
                datetime: 'date here',
                topics: 'some long description'
            },
            auth
        };
        // #4 - wrong datetime
        const res4 = await server.inject(options4);

        const options5 = {
            method: 'POST',
            url: '/lectures',
            payload: {
                classId: 'd894ca1038f854aa19b73de4',
                datetime: new Date('2019-11-10T12:40:00'),
                topics: 12.5
            },
            auth
        };
        // #5 - wrong topics
        const res5 = await server.inject(options5);

        const options6 = {
            method: 'POST',
            url: '/lectures',
            payload: {
                classId: 'd894ca1038f854aa19b73de4',
                datetime: new Date('2019-11-10T12:40:00'),
                topics: 'some long description'
            },
            auth
        };
        // #6 - teacher null
        const res6 = await server.inject(options6);
        // #7 - weekhour null
        const res7 = await server.inject(options6);

        const options7 = {
            method: 'POST',
            url: '/lectures',
            payload: {
                classId: 'd894ca1038f854aa19b73de4',
                datetime: future,
                topics: 'some long description'
            },
            auth
        };
        // #7 - day in the future
        const res8 = await server.inject(options7);

        const options8 = {
            method: 'POST',
            url: '/lectures',
            payload: {
                classId: 'd894ca1038f854aa19b73de4',
                datetime: beforeWeekStart,
                topics: 'some long description'
            },
            auth
        };
        // #8 - day before week start
        const res9 = await server.inject(options8);
        
        expect(res1.statusCode).to.equal(302);
        expect(res2.statusCode).to.equal(403);
        expect(res3.statusCode).to.equal(400);
        expect(res4.statusCode).to.equal(400);
        expect(res5.statusCode).to.equal(400);
        expect(res6.statusCode).to.equal(400);
        expect(res7.statusCode).to.equal(400);
        expect(res8.statusCode).to.equal(400);
        expect(res9.statusCode).to.equal(400);

        expect(teacherFindOne.callCount).to.equal(4);
        expect(teacherFindOne.calledWithExactly({ userId: '6dc7a207b74c6e7109ba53cd' })).to.be.true();
        expect(utilsDateToWeekhour.callCount).to.equal(4);
        expect(utilsDateToWeekhour.calledWithExactly(new Date('2019-11-10T12:00:00'))).to.be.true();

        teacherFindOne.restore();
        utilsDateToWeekhour.restore();

    });

    test('Date.getNormalizedDay', async () => {
        const nd1 = new Date('2019-01-04T16:00:00').getNormalizedDay();
        const nd2 = new Date('2019-02-11T12:00:00').getNormalizedDay();
        const nd3 = new Date('2019-06-04T10:00:00').getNormalizedDay();
        const nd4 = new Date('2019-10-31T14:00:00').getNormalizedDay();
        const nd5 = new Date('2019-03-23T08:00:00').getNormalizedDay();
        const nd6 = new Date('2019-05-15T09:00:00').getNormalizedDay();
        const nd7 = new Date('2019-12-29T11:00:00').getNormalizedDay();
        expect(nd1).to.equal(4);
        expect(nd2).to.equal(0);
        expect(nd3).to.equal(1);
        expect(nd4).to.equal(3);
        expect(nd5).to.equal(5);
        expect(nd6).to.equal(2);
        expect(nd7).to.equal(6);
    });

    test('Date.weekStart', async () => {
        const ws1 = new Date('2019-01-02T12:00:00').weekStart();
        const ws2 = new Date('2019-02-15T18:00:00').weekStart();
        const ws3 = new Date('2019-06-08T08:00:00').weekStart();
        const ws4 = new Date('2019-10-29T11:00:00').weekStart();
        const ws5 = new Date('2019-03-21T19:00:00').weekStart();
        const ws6 = new Date('2019-05-18T15:00:00').weekStart();
        const ws7 = new Date('2019-12-22T09:00:00').weekStart();
        expect(ws1).to.equal(new Date('2018-12-31T00:00:00'));
        expect(ws2).to.equal(new Date('2019-02-11T00:00:00'));
        expect(ws3).to.equal(new Date('2019-06-03T00:00:00'));
        expect(ws4).to.equal(new Date('2019-10-28T00:00:00'));
        expect(ws5).to.equal(new Date('2019-03-18T00:00:00'));
        expect(ws6).to.equal(new Date('2019-05-13T00:00:00'));
        expect(ws7).to.equal(new Date('2019-12-16T00:00:00'));
        
    });

    test('utils.weekhourToDate', async () => {
        const ws = new Date().weekStart();
        const d1 = Utils.weekhourToDate('0_4');
        const d2 = Utils.weekhourToDate('1_1');
        const d3 = Utils.weekhourToDate('3_2');
        const d4 = Utils.weekhourToDate('1_4');
        const d5 = Utils.weekhourToDate('4_4');
        const d6 = Utils.weekhourToDate('2_0');
        const d7 = Utils.weekhourToDate('3_1');
        const d8 = Utils.weekhourToDate('5_5');
        const d9 = Utils.weekhourToDate('6_0');
        const d10 = Utils.weekhourToDate('7_3');
        expect(d1).to.equal(new Date(ws.getTime() + (Utils.startHour + 4) * Utils.hour));
        expect(d2).to.equal(new Date(ws.getTime() + 1 * Utils.day + (Utils.startHour + 1) * Utils.hour));
        expect(d3).to.equal(new Date(ws.getTime() + 3 * Utils.day + (Utils.startHour + 2) * Utils.hour));
        expect(d4).to.equal(new Date(ws.getTime() + 1 * Utils.day + (Utils.startHour + 4) * Utils.hour));
        expect(d5).to.equal(new Date(ws.getTime() + 4 * Utils.day + (Utils.startHour + 4) * Utils.hour));
        expect(d6).to.equal(new Date(ws.getTime() + 2 * Utils.day + (Utils.startHour + 0) * Utils.hour));
        expect(d7).to.equal(new Date(ws.getTime() + 3 * Utils.day + (Utils.startHour + 1) * Utils.hour));
        expect(d8).to.equal(new Date(ws.getTime() + 5 * Utils.day + (Utils.startHour + 5) * Utils.hour));
        expect(d9).to.equal(new Date(ws.getTime() + 6 * Utils.day + (Utils.startHour + 0) * Utils.hour));
        expect(d10).to.equal(new Date(ws.getTime() + 7 * Utils.day + (Utils.startHour + 3) * Utils.hour));
    });

    test('utils.dateToWeekhour', async () => {
        const wh1 = Utils.dateToWeekhour(new Date('2019-01-04T16:10:00'));
        const wh2 = Utils.dateToWeekhour(new Date('2019-02-11T12:26:00'));
        const wh3 = Utils.dateToWeekhour(new Date('2019-06-04T10:06:00'));
        const wh4 = Utils.dateToWeekhour(new Date('2019-10-31T14:24:00'));
        const wh5 = Utils.dateToWeekhour(new Date('2019-03-23T08:45:00'));
        const wh6 = Utils.dateToWeekhour(new Date('2019-05-15T09:03:00'));
        const wh7 = Utils.dateToWeekhour(new Date('2019-12-29T11:19:00'));
        const wh8 = Utils.dateToWeekhour(new Date('2019-07-19T13:50:00'));
        const wh9 = Utils.dateToWeekhour(new Date('2019-04-11T18:27:00'));
        const wh10 = Utils.dateToWeekhour(new Date('2019-11-14T08:40:00'));
        const wh11 = Utils.dateToWeekhour(new Date('2019-09-26T06:12:00'));
        expect(wh1).to.equal(null);
        expect(wh2).to.equal('0_4');
        expect(wh3).to.equal('1_2');
        expect(wh4).to.equal(null);
        expect(wh5).to.equal(null);
        expect(wh6).to.equal('2_1');
        expect(wh7).to.equal(null);
        expect(wh8).to.equal('4_5');
        expect(wh9).to.equal(null);
        expect(wh10).to.equal('3_0');
        expect(wh11).to.equal(null);
    });
    
});