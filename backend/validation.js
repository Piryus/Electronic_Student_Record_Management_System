const Joi = require('@hapi/joi');

const schema = {
    id: Joi.string().hex().length(24),
    date: Joi.date(),
    longText: Joi.string().min(1).max(4096)
};

module.exports = schema;