'use strict';

const Boom = require('boom');

const Article = require('../../models/Article');
const User = require('../../models/User');

const recordNewArticle = async function (userId, title, content) {
    try {
        const article = new Article({
            title: title,
            content: content,
            author: userId,
            date: new Date()
        });
        await article.save();
        return {success: true};
    } catch (e) {
        return Boom.badImplementation(e);
    }
};

const getArticles = async function () {
    try {
        const articles = await Article.find({});
        let articlesWithAuthor = [];
        for (const article of articles) {
            let author = await User.findById(article.author);
            let authorStr = [author.name, author.surname].join(' ');
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
    } catch (e) {
        return Boom.badImplementation(e);
    }
};

module.exports = {
    getArticles,
    recordNewArticle
};