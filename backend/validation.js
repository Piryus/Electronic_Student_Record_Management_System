const Joi = require('@hapi/joi');

const schema = {
    array: Joi.array(),
    id: Joi.string().hex().length(24),
    ssn: Joi.string(),
    name: Joi.string(),
    date: Joi.date(),
    class: Joi.string().regex(/^[1-5][a-zA-Z]$/),
    longText: Joi.string().min(1).max(4096)
};

module.exports = schema;