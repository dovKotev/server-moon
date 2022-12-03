const express = require("express");
const router = express.Router();

const auth = require("../../Helpers/authMiddleware");

const validationCard = require("../validation/cardValidation");
const Card = require("../models/cardModel");

router.post("/create-card", auth, async (req, res) => {
  const {error} = validationCard(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!req.admin) return res.send(401).send("You ara not authorization!");

  const card = new Card(req.body);
  card.userID = req.userID;

  await card.save();

  res.status(201).send(card);
});

router.put("/edit", auth, async (req, res) => {
  // <<<<   send a full card >>>>>>
  const cardId = req.body._id;

  if (!req.admin) return res.send(401).send("You ara not authorization!");

  try {
    const card = await Card.findOneAndUpdate({_id: cardId}, req.body, {
      returnOriginal: false,
    });
    res.status(200).send(card);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/delete", auth, async (req, res) => {
  if (!req.admin) return res.send(401).send("You ara not authorization!");
  try {
    // <<<<   send a full card
    const cardId = req.body._id;

    const {data} = await Card.findOneAndDelete({_id: cardId});

    res.status(200).send(data);
  } catch ({data}) {
    res.status(400).send(data);
  }
});

router.post("/mycards", auth, async (req, res) => {
  try {
    if (!req.body) return res.send("Empty cart");
    const data = req.body;

    const cardsID = data.map((item) => {
      return item.cardID;
    });

    let cards = await Card.find({_id: {$in: cardsID}});

    const newCardsArray = [];

    for (const card of cards) {
      for (const oneData of data) {
        if (card._id == oneData.cardID) {
          newCardsArray.push({
            name: card.name,
            image: card.image,
            description: card.description,
            quantity: oneData.quantity,
            price: card.price,
            _id: card._id,
          });
        }
      }
    }
    res.json(newCardsArray);
  } catch (err) {
    res.status(400).send("Problem");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    return res.status(200).send(card);
  } catch (err) {
    res.status(400).send("Fail to bring Card");
  }
});

router.get("/", async (req, res) => {
  const cards = await Card.find();
  res.send(cards);
});

module.exports = router;
