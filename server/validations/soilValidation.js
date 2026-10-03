const Joi = require("joi");

const soilSchema = Joi.object({
  farm: Joi.string().required(),

  nitrogen: Joi.number().min(0),
  phosphorus: Joi.number().min(0),
  potassium: Joi.number().min(0),

  ph: Joi.number().min(0).max(14),

  moisture: Joi.number().min(0),

  temperature: Joi.number(),
});

module.exports = soilSchema;
