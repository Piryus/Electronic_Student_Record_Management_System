'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Teacher = require('../models/Teacher');
const User = require ('../models/User');

const teachers = require ('../routes/teachers/handlers');

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

suite('teachers', () => {

    test('getNotes', async () => {
        await Student.insertMany(testData.students);
        await Parent.insertMany(testData.parents);
        await Teacher.insertMany(testData.teachers);
        await User.insertMany(testData.users);

        // teacher not found
        const n1 = await teachers.getNotes('ffffffffffffffffffffffff');

        // ok 1
        const n2 = await teachers.getNotes('5dca7e2b461dc52d681804f5');
        
        await Student.updateOne({ _id: '5dca711c89bf46419cf5d489' }, { notes: [
            { _id: '5dca7e2bfcc5b52d681804f6', teacherId: '5dca6cf0a92bbb4dd8c0e817', description: 'This is a first notice.', date: new Date('2019-11-10T10:06:04') },
            { _id: '5dca7e2bfcc5b52d681804f7', teacherId: '5dca6cd5b83a1f3ef03e962b', description: 'The situation is getting worse.', date: new Date('2019-11-18T11:02:19') }
        ] });
        
        // ok 2
        const n3 = await teachers.getNotes('5dca7e2b461dc52d681804f5');

        await Student.updateOne({ _id: '5dca711c89bf46419cf5d48e' }, { notes: [
            { _id: '5dca7e2bfcc5b52d681804f6', teacherId: '5dca6cf0a92bbb4dd8c0e817', description: 'Really bad.', date: new Date('2019-11-14T12:13:46') }
        ] });
        
        // ok 3
        const n4 = await teachers.getNotes('5dca7e2b461dc52d681804f5');
        
        expect(n1.output.statusCode).to.equal(BAD_REQUEST);
        expect(n2.notes).to.have.length(0);
        expect(n3.notes).to.have.length(1);
        jexpect(n3.notes[0]).to.equal(j({ teacherId: '5dca6cf0a92bbb4dd8c0e817', description: 'This is a first notice.', date: new Date('2019-11-10T10:06:04'), studentId: '5dca711c89bf46419cf5d489', student: 'Enzo Cremonesi' }));
        expect(n4.notes).to.have.length(2);
        jexpect(n4.notes[0]).to.equal(j({ teacherId: '5dca6cf0a92bbb4dd8c0e817', description: 'Really bad.', date: new Date('2019-11-14T12:13:46'), studentId: '5dca711c89bf46419cf5d48e', student: 'Anna Bianchi' }));
        jexpect(n4.notes[1]).to.equal(j({ teacherId: '5dca6cf0a92bbb4dd8c0e817', description: 'This is a first notice.', date: new Date('2019-11-10T10:06:04'), studentId: '5dca711c89bf46419cf5d489', student: 'Enzo Cremonesi' }));
    });

    test('getMeetingsAvailability', async () => {
        const data = ['0_4', '1_3', '3_2'];

        await Teacher.insertMany(testData.teachers);

        // teacher not found
        const ma1 = await teachers.getMeetingsAvailability('ffffffffffffffffffffffff');
        // ok 1
        const ma2 = await teachers.getMeetingsAvailability('5dca7e2b461dc52d681804f2');

        await Teacher.updateOne({ _id: '5dca69cf048e8e40d434017f' }, { meetingsTimeSlots: data });
        
        // ok 2
        const ma3 = await teachers.getMeetingsAvailability('5dca7e2b461dc52d681804f2');

        expect(ma1.output.statusCode).to.equal(BAD_REQUEST);
        expect(ma2.timeSlots).to.have.length(0);
        expect(ma3.timeSlots).to.have.length(3);
        expect(ma3.timeSlots).to.equal(data);
    });

    test('setMeetingsAvailability', async () => {
        await Teacher.insertMany(testData.teachers);

        // teacher not found
        const ma1 = await teachers.setMeetingsAvailability('ffffffffffffffffffffffff', ['1_2', '4_0']);
        // use lecture time slot
        const ma2 = await teachers.setMeetingsAvailability('5dca7e2b461dc52d681804f3', ['1_2', '4_2']);

        const t1 = await Teacher.findById('5dca6cbe7adca3346c5983cb');
        
        // ok 1
        const ma3 = await teachers.setMeetingsAvailability('5dca7e2b461dc52d681804f3', ['1_5', '4_3']);

        const t2 = await Teacher.findById('5dca6cbe7adca3346c5983cb');
        
        // ok 2
        const ma4 = await teachers.setMeetingsAvailability('5dca7e2b461dc52d681804f3', []);

        const t3 = await Teacher.findById('5dca6cbe7adca3346c5983cb');
        
        // ok 2
        const ma5 = await teachers.setMeetingsAvailability('5dca7e2b461dc52d681804f3', ['2_0', '3_3', '4_1']);

        const t4 = await Teacher.findById('5dca6cbe7adca3346c5983cb');

        expect(ma1.output.statusCode).to.equal(BAD_REQUEST);
        expect(ma2.output.statusCode).to.equal(BAD_REQUEST);
        expect(t1.meetingsTimeSlots).to.have.length(0);
        expect(ma3.success).to.be.true();
        expect(t2.meetingsTimeSlots).to.have.length(2);
        expect(t2.meetingsTimeSlots).to.equal(['1_5', '4_3']);
        expect(ma4.success).to.be.true();
        expect(t3.meetingsTimeSlots).to.have.length(0);
        expect(ma5.success).to.be.true();
        expect(t4.meetingsTimeSlots).to.have.length(3);
        expect(t4.meetingsTimeSlots).to.equal(['2_0', '3_3', '4_1']);
    });

});