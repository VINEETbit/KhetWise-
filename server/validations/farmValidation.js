const Joi = require("joi");

const farmSchema = Joi.object({
  name: Joi.string().required(),

  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),

  area: Joi.number().positive().required(),

  soilType: Joi.string().required(),

  crop: Joi.string().allow(""),
});

module.exports = farmSchema;
