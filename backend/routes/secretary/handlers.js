'use strict';

const Boom = require('boom');
const HLib = require('@emarkk/hlib');

const Utils = require('../../utils');

const Article = require('../../models/Article');
const Parent = require('../../models/Parent');
const Student = require('../../models/Student');
const User = require('../../models/User');

const getArticles = async function() {
    const articles = await Article.find({}).populate({
        path: 'authorId',
        select: 'name surname'
    });

    return { articles: articles.sort((a, b) => b.date - a.date) };
};

const addArticle = async function(officerUId, title, content) {
    const article = new Article({ title, content, authorId: officerUId });
    await article.save();

    return { success: true };
};

const addParent = async function(ssn, name, surname, mail, childSsn) {
    const existingUser = await User.findOne({ mail });
    const student = await Student.findOne({ ssn: childSsn });

    if(existingUser !== null || student === null)
        return Boom.badRequest();
    
    const password = HLib.getRandomPassword();

    const user = new User({ ssn, name, surname, mail, password, scope: ['parent'] });
    await user.save();
    const parent = new Parent({ userId: user._id, children: [student._id] });
    await parent.save();

    Utils.sendWelcomeEmail(mail, name + ' ' + surname, password);

    return { success: true };
};

module.exports = {
    getArticles,
    addArticle,
    addParent
};