const Joi = require("joi");

const recommendationSchema = Joi.object({
  farm: Joi.string().required(),

  type: Joi.string()
    .valid("crop", "fertilizer", "irrigation", "disease", "yield")
    .required(),

  recommendation: Joi.string().required(),

  confidence: Joi.number().min(0).max(1),
});

module.exports = recommendationSchema;































