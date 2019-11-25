const Joi = require('@hapi/joi');

let schema = {
    array: Joi.array(),
    id: Joi.string().hex().length(24),
    ssn: Joi.string(),
    name: Joi.string(),
    date: Joi.date(),
    weekhour: Joi.string().regex(/^[0-4]_[0-5]$/),
    className: Joi.string().regex(/^[1-5][a-zA-Z]$/),
    subject: Joi.string(),
    longText: Joi.string().min(1).max(4096),
    mail: Joi.string().email(),
    grade: Joi.string().regex(/^([0-9]\+?|([1-9]|10)\-|[0-9](\.5|( | and )1\/2)|0\/1|1\/2|2\/3|3\/4|4\/5|5\/6|6\/7|7\/8|8\/9|9\/10|10(l|L| cum laude)?)$/),
    attendanceEvent: Joi.string().valid('absence', 'late-entrance', 'early-exit'),
    articleTitle: Joi.string(),
    articleContent: Joi.string(),
    password: Joi.string().min(8).max(56),
    role: Joi.string()
};

schema.gradeInfo = {
    studentId: schema.id,
    grade: schema.grade
};
schema.attendanceInfo = {
    studentId: schema.id,
    attendanceEvent: schema.attendanceEvent
};

module.exports = schema;