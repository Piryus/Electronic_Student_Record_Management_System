const Joi = require('@hapi/joi');

const schema = {
    id: Joi.string().hex().length(24),
    ssn: Joi.string(),
    name: Joi.string(),
    date: Joi.date(),
    class: Joi.string().regex(/^[1-5][a-zA-Z]$/),
    studentsArray: Joi.array().items(Joi.string().required()),
    longText: Joi.string().min(1).max(4096)
};

module.exports = schema;