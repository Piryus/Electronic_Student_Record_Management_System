'use strict';

const Boom = require('boom');

const Utils = require('../../utils');

const Article = require('../../models/Article');
const Parent = require('../../models/Parent');
const Student = require('../../models/Student');
const User = require('../../models/User');

const getArticles = async function() {
    const articles = await Article.find({});
    let articlesWithAuthor = [];
    for (const article of articles) {
        // Author formatting
        let author = await User.findById(article.author);
        let authorStr = 'Unknown author';
        if (author !== null) {
            authorStr = [author.name, author.surname].join(' ');
        }
        // Date formatting
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = article.date.toLocaleDateString("en-US", dateOptions);
        const newArticle = {
            id: article._id,
            title: article.title,
            content: article.content,
            date: formattedDate,
            author: authorStr
        };
        articlesWithAuthor.push(newArticle);
    }
    return articlesWithAuthor.reverse();
};

const addArticle = async function(officerUId, title, content) {
    const article = new Article({ title, content, authorId: officerUId });
    await article.save();

    return {success: true};
};

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
    getArticles,
    addArticle,
    addParent
};