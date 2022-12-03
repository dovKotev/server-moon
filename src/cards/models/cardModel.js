const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 700,
  },
  image: {
    type: String,
  },
  price: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  createdAt: {type: Date, default: Date.now},
});

const Card = mongoose.model("Cards", cardSchema);

module.exports = Card;
