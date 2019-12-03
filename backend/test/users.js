'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const BAD_REQUEST = 400;
const db = require('../test-lib/db');
const testData = require('../test-lib/testData');

const HLib = require('@emarkk/hlib');

const Utils = require('../utils');

const User = require('../models/User');

const users = require ('../routes/users/handlers');

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

suite('users', () => {

    test('getUsers', async () => {
        const u1 = await users.getUsers();

        await User.insertMany(testData.users);

        const u2 = await users.getUsers();

        expect(u1.users).to.have.length(0);
        expect(u2.users).to.have.length(11);
        expect(u2.users.some(u => u.password !== undefined)).to.be.false();
        expect(u2.users.some(u => u.scope.includes('parent') || u.scope.includes('admin'))).to.be.false();
    });

    test('addUser', async () => {
        const fakePassword = Sinon.stub(HLib, 'getRandomPassword');
        const fakeMail = Sinon.stub(Utils, 'sendWelcomeEmail');

        fakePassword.onCall(0).returns(')<6FlOD-(&Jt>&3@');
        fakePassword.onCall(1).returns('!gm)tn^&xKozEcD-');
        fakePassword.onCall(2).returns('Nsnu&12J+&)3yt3J');
        fakePassword.onCall(3).returns('gAnrP8D^MdhsIB6M');
        fakePassword.onCall(4).returns('v-t*2zt6sA<Nnn58');

        const u1 = await User.find();

        const a1 = await users.addUser('luca.ferrari@teacher.com', 'Luca', 'Ferrari', 'SPRKJCJDINDI', ['teacher']);
        
        const u2 = await User.find();

        const a2 = await users.addUser('renzo.disso@parent.com', 'Renzo', 'Disso', 'ENIFONEOBVUODV', ['parent']);
        const a3 = await users.addUser('barbo.collo@officer.com', 'Barbo', 'Collo', 'FNONOVNSOVBE', ['officer']);
        const a4 = await users.addUser('ettore.rotolini@parent.com', 'Ettore', 'Rotolini', 'FOEFBUSBVUOSG', ['parent']);
        const a5 = await users.addUser('asso.paglia@teacher.com', 'Asso', 'Paglia', 'FEBOFBSUOVB', ['teacher']);

        const u3 = await User.find();

        const a6 = await users.addUser('luca.ferrari@teacher.com', 'Strange', 'User', 'NOFDNGVOUDBVUO', ['teacher']);

        fakePassword.restore();
        fakeMail.restore();

        expect(u1).to.have.length(0);
        expect(a1.success).to.be.true();
        expect(u2).to.have.length(1);
        expect(a2.success).to.be.true();
        expect(a3.success).to.be.true();
        expect(a4.success).to.be.true();
        expect(a5.success).to.be.true();
        expect(u3).to.have.length(5);
        expect(a6.output.statusCode).to.equal(BAD_REQUEST);
        expect(fakePassword.callCount).to.equal(5);
        expect(fakeMail.callCount).to.equal(5);
        expect(fakeMail.calledWith('luca.ferrari@teacher.com', 'Luca Ferrari', ')<6FlOD-(&Jt>&3@')).to.be.true();
        expect(fakeMail.calledWith('renzo.disso@parent.com', 'Renzo Disso', '!gm)tn^&xKozEcD-')).to.be.true();
        expect(fakeMail.calledWith('barbo.collo@officer.com', 'Barbo Collo', 'Nsnu&12J+&)3yt3J')).to.be.true();
        expect(fakeMail.calledWith('ettore.rotolini@parent.com', 'Ettore Rotolini', 'gAnrP8D^MdhsIB6M')).to.be.true();
        expect(fakeMail.calledWith('asso.paglia@teacher.com', 'Asso Paglia', 'v-t*2zt6sA<Nnn58')).to.be.true();
    });

    test('updateUser', async () => {
        await User.insertMany(testData.users);

        const u1 = await User.findById('5dca7e2b461dc52d681804fa');

        const up1 = await users.updateUser('5dca7e2b461dc52d681804fa', 'updated@mail.com', 'NewName', 'NewSurname', 'NEWSSN', ['parent']);
        
        const u2 = await User.findById('5dca7e2b461dc52d681804fa');

        expect(u1.ssn).to.equal('JFMCL00C02H025N');
        expect(u1.name).to.equal('Tiziana');
        expect(u1.surname).to.equal('Gentile');
        expect(u1.scope).to.equal(['parent']);
        expect(u1.mail).to.equal('tiziana.gentile@parent.com');
        expect(up1.success).to.be.true();
        expect(u2.ssn).to.equal('NEWSSN');
        expect(u2.name).to.equal('NewName');
        expect(u2.surname).to.equal('NewSurname');
        expect(u2.scope).to.equal(['parent']);
        expect(u2.mail).to.equal('updated@mail.com');
    });

    test('deleteUser', async () => {
        await User.insertMany(testData.users);

        const u1 = await User.find();

        const d1 = await users.deleteUser('5dca7e2b461dc52d681804f4');

        const u2 = await User.find();

        const d2 = await users.deleteUser('5dca7e2b461dc52d681804fc');
        const d3 = await users.deleteUser('5dcc0bb71c9d440000330d8d');
        const d4 = await users.deleteUser('ffffffffffffffffffffffff');
        
        const u3 = await User.find();

        expect(u1).to.have.length(18);
        expect(u1.map(u => u._id.toString())).to.include(['5dca7e2b461dc52d681804f4', '5dca7e2b461dc52d681804fc', '5dcc0bb71c9d440000330d8d']);
        expect(d1.success).to.be.true();
        expect(u2).to.have.length(17);
        expect(u2.map(u => u._id.toString())).to.not.include('5dca7e2b461dc52d681804f4');
        expect(u2.map(u => u._id.toString())).to.include(['5dca7e2b461dc52d681804fc', '5dcc0bb71c9d440000330d8d']);
        expect(d2.success).to.be.true();
        expect(d3.success).to.be.true();
        expect(d4.success).to.be.true();
        expect(u3).to.have.length(15);
        expect(u3.map(u => u._id.toString())).to.not.include(['5dca7e2b461dc52d681804f4', '5dca7e2b461dc52d681804fc', '5dcc0bb71c9d440000330d8d']);
    });

});