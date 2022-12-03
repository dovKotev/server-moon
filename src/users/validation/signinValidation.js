const Joi = require("joi");

function validationSignin(user) {
  const schema = {
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  };

  return Joi.object(schema).validate(user);
}

module.exports = validationSignin;
