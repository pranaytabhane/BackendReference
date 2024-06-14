
const Joi = require('joi');


const addSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.allow('').optional(),
});

module.exports = {
    addSchema,
}