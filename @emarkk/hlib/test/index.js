'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const HLib = require('../index');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;

suite('HLib', () => {
    
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

    test('String.isTimeIncludedInWeekhours', async () => {
        const tiw1 = '08:23'.isTimeIncludedInWeekhours(['2_0', '2_1']);
        const tiw2 = '11:22'.isTimeIncludedInWeekhours(['4_3']);
        const tiw3 = '12:23'.isTimeIncludedInWeekhours(['1_4']);
        const tiw4 = '10:56'.isTimeIncludedInWeekhours(['1_5']);
        const tiw5 = '09:51'.isTimeIncludedInWeekhours(['2_2']);
        const tiw6 = '12:38'.isTimeIncludedInWeekhours(['3_1', '3_4']);
        const tiw7 = '08:42'.isTimeIncludedInWeekhours(['2_0']);
        const tiw8 = '13:06'.isTimeIncludedInWeekhours(['3_3']);
        const tiw9 = '08:16'.isTimeIncludedInWeekhours(['0_4']);
        const tiw10 = '12:50'.isTimeIncludedInWeekhours(['1_2', '1_3']);
        const tiw11 = '10:11'.isTimeIncludedInWeekhours(['4_4']);
        const tiw12 = '11:33'.isTimeIncludedInWeekhours(['1_3']);
        const tiw13 = '09:40'.isTimeIncludedInWeekhours(['1_5']);
        const tiw14 = '13:38'.isTimeIncludedInWeekhours(['2_2', '2_3']);
        const tiw15 = '11:09'.isTimeIncludedInWeekhours(['4_0']);
        expect(tiw1).to.be.true();
        expect(tiw2).to.be.true();
        expect(tiw3).to.be.true();
        expect(tiw4).to.be.false();
        expect(tiw5).to.be.false();
        expect(tiw6).to.be.true();
        expect(tiw7).to.be.true();
        expect(tiw8).to.be.false();
        expect(tiw9).to.be.false();
        expect(tiw10).to.be.false();
        expect(tiw11).to.be.false();
        expect(tiw12).to.be.true();
        expect(tiw13).to.be.false();
        expect(tiw14).to.be.false();
        expect(tiw15).to.be.false();
    });
    
    test('String.isTimeValidFor', async () => {
        const tv1 = '08:02'.isTimeValidFor('late-entrance');
        const tv2 = '08:05'.isTimeValidFor('late-entrance');
        const tv3 = '08:00'.isTimeValidFor('late-entrance');
        const tv4 = '08:07'.isTimeValidFor('late-entrance');
        const tv5 = '08:10'.isTimeValidFor('late-entrance');
        const tv6 = '08:11'.isTimeValidFor('late-entrance');
        const tv7 = '09:00'.isTimeValidFor('late-entrance');
        const tv8 = '08:09'.isTimeValidFor('late-entrance');
        const tv9 = '09:01'.isTimeValidFor('late-entrance');
        const tv10 = '10:00'.isTimeValidFor('late-entrance');
        const tv11 = 'whatever'.isTimeValidFor('whatever');
        expect(tv1).to.be.true();
        expect(tv2).to.be.true();
        expect(tv3).to.be.false();
        expect(tv4).to.be.true();
        expect(tv5).to.be.true();
        expect(tv6).to.be.false();
        expect(tv7).to.be.true();
        expect(tv8).to.be.true();
        expect(tv9).to.be.false();
        expect(tv10).to.be.false();
        expect(tv11).to.be.true();
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
        const i11 = new Date('2019-10-05T00:00:10').isSameDayOf(new Date('2019-10-05T01:00:20'));
        const i12 = new Date('2019-12-10T00:02:46').isSameDayOf(new Date('2019-12-09T23:40:32'));
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
        expect(i11).to.be.true();
        expect(i12).to.be.false();
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

    test('Date.isSchoolDay', async () => {
        const calendar = {
            academicYear: "2019/20",
            firstDay: new Date('2019-09-09T00:00:00'),
            lastDay: new Date('2020-06-10T00:00:00'),
            holidays:[
                { start: new Date('2019-11-01T00:00:00'), end: null },
                { start: new Date('2019-12-23T00:00:00'), end: new Date('2020-01-04T00:00:00') },
                { start: new Date('2020-02-22T00:00:00'), end: new Date('2020-02-26T00:00:00') },
                { start: new Date('2020-04-09T00:00:00'), end: new Date('2020-04-14T00:00:00') },
                { start: new Date('2019-05-02T00:00:00'), end: null },
                { start: new Date('2019-06-01T00:00:00'), end: null },
            ]
        };
        const isd1 = new Date('2019-11-14T08:14:00').isSchoolDay(calendar);
        const isd2 = new Date('2019-11-23T17:51:00').isSchoolDay(calendar);
        const isd3 = new Date('2019-12-15T11:39:00').isSchoolDay(calendar);
        const isd4 = new Date('2019-12-20T09:26:00').isSchoolDay(calendar);
        const isd5 = new Date('2020-01-08T13:45:00').isSchoolDay(calendar);
        const isd6 = new Date('2019-12-27T19:03:00').isSchoolDay(calendar);
        const isd7 = new Date('2020-01-03T14:38:00').isSchoolDay(calendar);
        const isd8 = new Date('2020-02-11T09:13:00').isSchoolDay(calendar);
        const isd9 = new Date('2019-12-23T13:55:00').isSchoolDay(calendar);
        const isd10 = new Date('2020-02-26T07:41:00').isSchoolDay(calendar);
        const isd11 = new Date('2020-04-08T13:20:00').isSchoolDay(calendar);
        const isd12 = new Date('2020-05-02T16:37:00').isSchoolDay(calendar);
        const isd13 = new Date('2020-06-15T14:05:00').isSchoolDay(calendar);
        const isd14 = new Date('2019-09-05T06:11:00').isSchoolDay(calendar);
        expect(isd1).to.be.true();
        expect(isd2).to.be.false();
        expect(isd3).to.be.false();
        expect(isd4).to.be.true();
        expect(isd5).to.be.true();
        expect(isd6).to.be.false();
        expect(isd7).to.be.false();
        expect(isd8).to.be.true();
        expect(isd9).to.be.false();
        expect(isd10).to.be.false();
        expect(isd11).to.be.true();
        expect(isd12).to.be.false();
        expect(isd13).to.be.false();
        expect(isd14).to.be.false();
    });

    test('getAY', async () => {
        const ay1 = HLib.getAY(new Date('2017-02-21T21:56:55'));
        const ay2 = HLib.getAY(new Date('2019-08-26T22:03:24'));
        const ay3 = HLib.getAY(new Date('2019-05-07T15:23:50'));
        const ay4 = HLib.getAY(new Date('2017-07-27T23:17:35'));
        const ay5 = HLib.getAY(new Date('2019-09-20T04:43:13'));
        const ay6 = HLib.getAY(new Date('2018-01-31T15:25:03'));
        const ay7 = HLib.getAY(new Date('2016-06-05T21:05:14'));
        expect(ay1).to.equal('2016/17');
        expect(ay2).to.be.null();
        expect(ay3).to.equal('2018/19');
        expect(ay4).to.be.null();
        expect(ay5).to.equal('2019/20');
        expect(ay6).to.equal('2017/18');
        expect(ay7).to.equal('2015/16');
    });

    test('timeToDate', async () => {
        const now = new Date(Date.now());
        const t = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + 'T';
        const d1 = HLib.timeToDate('16:10');
        const d2 = HLib.timeToDate('12:26');
        const d3 = HLib.timeToDate('10:06');
        const d4 = HLib.timeToDate('14:24');
        const d5 = HLib.timeToDate('08:45');
        const d6 = HLib.timeToDate('09:03');
        const d7 = HLib.timeToDate('11:19');
        const d8 = HLib.timeToDate('13:50');
        const d9 = HLib.timeToDate('18:27');
        const d10 = HLib.timeToDate('08:40');
        const d11 = HLib.timeToDate('06:12');
        expect(d1).to.equal(new Date(t + '16:10' + ':00'));
        expect(d2).to.equal(new Date(t + '12:26' + ':00'));
        expect(d3).to.equal(new Date(t + '10:06' + ':00'));
        expect(d4).to.equal(new Date(t + '14:24' + ':00'));
        expect(d5).to.equal(new Date(t + '08:45' + ':00'));
        expect(d6).to.equal(new Date(t + '09:03' + ':00'));
        expect(d7).to.equal(new Date(t + '11:19' + ':00'));
        expect(d8).to.equal(new Date(t + '13:50' + ':00'));
        expect(d9).to.equal(new Date(t + '18:27' + ':00'));
        expect(d10).to.equal(new Date(t + '08:40' + ':00'));
        expect(d11).to.equal(new Date(t + '06:12' + ':00'));
    });

    test('weekhourToDate', async () => {
        const ws = new Date().weekStart();
        const d1 = HLib.weekhourToDate('0_4');
        const d2 = HLib.weekhourToDate('1_1');
        const d3 = HLib.weekhourToDate('3_2');
        const d4 = HLib.weekhourToDate('1_4');
        const d5 = HLib.weekhourToDate('4_4');
        const d6 = HLib.weekhourToDate('2_0');
        const d7 = HLib.weekhourToDate('3_1');
        const d8 = HLib.weekhourToDate('5_5');
        const d9 = HLib.weekhourToDate('6_0');
        const d10 = HLib.weekhourToDate('7_3');
        expect(d1).to.equal(new Date(ws.getTime() + (HLib.startHour + 4) * HLib.hour));
        expect(d2).to.equal(new Date(ws.getTime() + 1 * HLib.day + (HLib.startHour + 1) * HLib.hour));
        expect(d3).to.equal(new Date(ws.getTime() + 3 * HLib.day + (HLib.startHour + 2) * HLib.hour));
        expect(d4).to.equal(new Date(ws.getTime() + 1 * HLib.day + (HLib.startHour + 4) * HLib.hour));
        expect(d5).to.equal(new Date(ws.getTime() + 4 * HLib.day + (HLib.startHour + 4) * HLib.hour));
        expect(d6).to.equal(new Date(ws.getTime() + 2 * HLib.day + (HLib.startHour + 0) * HLib.hour));
        expect(d7).to.equal(new Date(ws.getTime() + 3 * HLib.day + (HLib.startHour + 1) * HLib.hour));
        expect(d8).to.equal(new Date(ws.getTime() + 5 * HLib.day + (HLib.startHour + 5) * HLib.hour));
        expect(d9).to.equal(new Date(ws.getTime() + 6 * HLib.day + (HLib.startHour + 0) * HLib.hour));
        expect(d10).to.equal(new Date(ws.getTime() + 7 * HLib.day + (HLib.startHour + 3) * HLib.hour));
    });

    test('dateToWeekhour', async () => {
        const wh1 = HLib.dateToWeekhour(new Date('2019-01-04T16:10:00'));
        const wh2 = HLib.dateToWeekhour(new Date('2019-02-11T12:26:00'));
        const wh3 = HLib.dateToWeekhour(new Date('2019-06-04T10:06:00'));
        const wh4 = HLib.dateToWeekhour(new Date('2019-10-31T14:24:00'));
        const wh5 = HLib.dateToWeekhour(new Date('2019-03-23T08:45:00'));
        const wh6 = HLib.dateToWeekhour(new Date('2019-05-15T09:03:00'));
        const wh7 = HLib.dateToWeekhour(new Date('2019-12-29T11:19:00'));
        const wh8 = HLib.dateToWeekhour(new Date('2019-07-19T13:50:00'));
        const wh9 = HLib.dateToWeekhour(new Date('2019-04-11T18:27:00'));
        const wh10 = HLib.dateToWeekhour(new Date('2019-11-14T08:40:00'));
        const wh11 = HLib.dateToWeekhour(new Date('2019-09-26T06:12:00'));
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

    test('getGradesAverages', async () => {
        const ga1 = HLib.getGradesAverages([
            { value: '6 1/2', subject: 'Italian', date: new Date('2019-11-10T10:00:00') },
            { value: '8-', subject: 'Italian', date: new Date('2019-11-14T14:00:00') },
            { value: '10 cum laude', subject: 'Italian', date: new Date('2019-11-29T16:00:00') }
        ]);
        const ga2 = HLib.getGradesAverages([
            { value: '5.5', subject: 'Science', date: new Date('2019-11-10T10:00:00') },
            { value: '9-', subject: 'Math', date: new Date('2019-11-14T14:00:00') },
            { value: '7 1/2', subject: 'Science', date: new Date('2019-11-29T16:00:00') },
            { value: '8', subject: 'Physics', date: new Date('2019-12-01T09:00:00') },
            { value: '6 and 1/2', subject: 'Math', date: new Date('2019-12-04T11:00:00') },
            { value: '6+', subject: 'Latin', date: new Date('2019-12-08T09:00:00') }
        ]);
        const ga3 = HLib.getGradesAverages([
            { value: '6', subject: 'Art', date: new Date('2019-11-10T10:00:00') },
            { value: '8-', subject: 'Art', date: new Date('2019-11-14T14:00:00') },
            { value: '9/10', subject: 'Art', date: new Date('2019-11-29T16:00:00') }
        ]);
        expect(ga1).to.equal({ Italian: 8.08 });
        expect(ga2).to.equal({ Science: 6.50, Math: 7.63, Physics: 8, Latin: 6.25 });
        expect(ga3).to.equal({ Art: 7.83 });
    });

});