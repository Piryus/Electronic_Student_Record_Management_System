const Joi = require('@hapi/joi');

const schema = {
    array: Joi.array(),
    id: Joi.string().hex().length(24),
    ssn: Joi.string(),
    name: Joi.string(),
    date: Joi.date(),
    weekhour: Joi.string().regex(/^[0-4]_[0-5]$/),
    className: Joi.string().regex(/^[1-5][a-zA-Z]$/),
    longText: Joi.string().min(1).max(4096),
    mail: Joi.string().email()
};

module.exports = schema;
