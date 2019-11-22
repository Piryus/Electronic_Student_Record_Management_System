'use strict';

const Utils = require('../../utils');

const addParent = async function(ssn, name, surname, mail, childSsn) {
    const existingUser = await User.findOne({ mail });
    const student = await Student.findOne({ ssn: childSsn });

    if(existingUser !== null || student === null)
        return Boom.badRequest();
    
    const password = Utils.getRandomPassword();
    
    const user = new User({ ssn, name, surname, mail, password, scope: ['parent'] });
    await user.save();
    const parent = new Parent({ userId: user._id, children: [student._id] });
    await parent.save();

    Utils.sendWelcomeEmail(mail, name + ' ' + surname, password);

    return { success: true };
};

module.exports = {
    addParent
};