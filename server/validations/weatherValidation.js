const Joi = require("joi");

const weatherSchema = Joi.object({
  farm: Joi.string().required(),

  temperature: Joi.number(),
  humidity: Joi.number(),
  rainfall: Joi.number().min(0),
  windSpeed: Joi.number().min(0),
});

module.exports = weatherSchema;
