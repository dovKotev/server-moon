const Joi = require("joi");

function validationRegister(user) {
  const schema = {
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    favorits: Joi.array(),
    cart: Joi.array(),
    biz: Joi.boolean().required(),
    admin: Joi.string(),
  };

  return Joi.object(schema).validate(user);
}

module.exports = validationRegister;
