const Joi = require('@hapi/joi');

const schema = {
    id: Joi.string().hex().length(24),
    weekhourId: Joi.string().regex(/^(0-4)_(0-5)$/),
    longText: Joi.string().min(1).max(4096)
};

module.exports = schema;