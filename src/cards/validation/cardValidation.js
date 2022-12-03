const Joi = require("joi");

function validationCard(card) {
  const schema = {
    name: Joi.string().min(2).max(25).required(),
    description: Joi.string().min(10).max(700).required(),
    price: Joi.string().min(2).max(16).required(),
    image: Joi.string(),
  };

  return Joi.object(schema).validate(card);
}

module.exports = validationCard;
