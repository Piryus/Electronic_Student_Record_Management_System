'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const Utils = require('../utils');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;

suite('utils', () => {
    
    test('String.gradify', async () => {
        const g1 = '0.5'.gradify();
        const g2 = '3+'.gradify();
        const g3 = '6-'.gradify();
        const g4 = '8/9'.gradify();
        const g5 = '10L'.gradify();
        const g6 = '4 and 1/2'.gradify();
        const g7 = '10 cum laude'.gradify();
        const g8 = '7-'.gradify();
        const g9 = '9 1/2'.gradify();
        const g10 = '10l'.gradify();
        const g11 = '2/3'.gradify();
        const g12 = '5.25'.gradify();
        const g13 = '8.75'.gradify();
        const g14 = '2'.gradify();
        expect(g1).to.equal(0.5);
        expect(g2).to.equal(3.25);
        expect(g3).to.equal(5.75);
        expect(g4).to.equal(8.75);
        expect(g5).to.equal(10);
        expect(g6).to.equal(4.5);
        expect(g7).to.equal(10);
        expect(g8).to.equal(6.75);
        expect(g9).to.equal(9.5);
        expect(g10).to.equal(10);
        expect(g11).to.equal(2.75);
        expect(g12).to.equal(5.25);
        expect(g13).to.equal(8.75);
        expect(g14).to.equal(2);
    });
    
    test('Date.isSameDayOf', async () => {
        const i1 = new Date('2019-01-04T16:54:00').isSameDayOf(new Date('2019-01-04T13:11:59'));
        const i2 = new Date('2019-05-13T08:30:24').isSameDayOf(new Date('2019-05-13T01:53:17'));
        const i3 = new Date('2019-11-18T15:37:59').isSameDayOf(new Date('2018-11-07T14:34:51'));
        const i4 = new Date('2019-08-01T12:10:17').isSameDayOf(new Date('2019-08-01T23:40:35'));
        const i5 = new Date('2019-12-26T17:39:28').isSameDayOf(new Date('2019-11-06T18:44:23'));
        const i6 = new Date('2019-08-30T06:48:47').isSameDayOf(new Date('2019-08-30T04:17:49'));
        const i7 = new Date('2019-03-04T11:51:31').isSameDayOf(new Date('2019-03-19T16:40:50'));
        const i8 = new Date('2019-07-09T07:19:28').isSameDayOf(new Date('2019-07-09T17:46:02'));
        const i9 = new Date('2019-05-21T02:50:53').isSameDayOf(new Date('2019-05-11T08:18:52'));
        const i10 = new Date('2019-11-13T19:32:40').isSameDayOf(new Date('2019-10-17T12:40:32'));
        expect(i1).to.be.true();
        expect(i2).to.be.true();
        expect(i3).to.be.false();
        expect(i4).to.be.true();
        expect(i5).to.be.false();
        expect(i6).to.be.true();
        expect(i7).to.be.false();
        expect(i8).to.be.true();
        expect(i9).to.be.false();
        expect(i10).to.be.false();
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

    test('utils.getAY', async () => {
        const ay1 = Utils.getAY(new Date('2017-02-21T21:56:55'));
        const ay2 = Utils.getAY(new Date('2019-08-26T22:03:24'));
        const ay3 = Utils.getAY(new Date('2019-05-07T15:23:50'));
        const ay4 = Utils.getAY(new Date('2017-07-27T23:17:35'));
        const ay5 = Utils.getAY(new Date('2019-09-20T04:43:13'));
        const ay6 = Utils.getAY(new Date('2018-01-31T15:25:03'));
        const ay7 = Utils.getAY(new Date('2016-06-05T21:05:14'));
        expect(ay1).to.equal('2016/17');
        expect(ay2).to.be.null();
        expect(ay3).to.equal('2018/19');
        expect(ay4).to.be.null();
        expect(ay5).to.equal('2019/20');
        expect(ay6).to.equal('2017/18');
        expect(ay7).to.equal('2015/16');
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