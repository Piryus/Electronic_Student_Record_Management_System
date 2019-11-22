'use strict';

const Valid = require('../../validation');
const handlers = require('./handlers');

const routes = [
    // Endpoint to add an article to the database
    {
        method: 'POST',
        path: '/articles/post',
        handler: async (request, h) => {
            const {title, content} = request.payload;
            return handlers.recordNewArticle(request.auth.credentials.id, title, content);
        },
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            },
            validate: {
                payload: {
                    title: Valid.articleTitle.required(),
                    content: Valid.articleContent.required()
                }
            }
        }
    },
    // Endpoint to retrieve the articles in the database
    {
        method: 'GET',
        path: '/articles/all',
        handler: async (request, h) => handlers.getArticles(),
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            }
        }
    },
];

module.exports = routes;