const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .allow(""),

  role: Joi.string().valid("farmer", "expert", "admin"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
