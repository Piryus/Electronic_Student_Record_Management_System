'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const Utils = require('../utils');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;

suite('utils', () => {
    
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