const _ = require("lodash");
const express = require("express");
const router = express.Router();

const validationRegister = require("../validation/registerValidation");
const validationSignin = require("../validation/signinValidation");

const User = require("../models/userModel");
const {generatePassword, compearePassword} = require("../Helpers/encrypt");
const {generateToken} = require("../../Helpers/token");

const auth = require("../../Helpers/authMiddleware");

router.post("/register", async (req, res) => {
  const {error} = validationRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (user) return res.status(400).send("User already registred");

  if (req.body.biz) {
    if (req.body.admin !== "*5544")
      return res.status(400).send("Admin Access denied");
  }
  user = new User(req.body);
  user.password = generatePassword(req.body.password);

  await user.save();
  res.send(_.pick(user, ["_id", "name", "email", "biz"]));
});

router.post("/signin", async (req, res) => {
  const {error} = validationSignin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send("Email or password not valid");

  let passwordValid = compearePassword(req.body.password, user.password);
  if (!passwordValid)
    return res.status(400).send("Email or password not valid");

  res.send(generateToken(user));
});

router.get("/userdata", auth, (req, response) => {
  const mongoDbUserId = req.userID;

  User.findById(mongoDbUserId)
    .select("-password")
    .then((user) => response.json(user))
    .catch((errorsFromMongoose) =>
      response.status(500).json(errorsFromMongoose)
    );
});

router.put("/edit-products-quantity", auth, async (req, res) => {
  // array of cart
  const userID = req.userID;

  try {
    const user = await User.findById(userID);
    user.cart = req.body;
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(200).send(err);
  }
});

router.put("/delete-product", auth, async (req, res) => {
  // id
  const userID = req.userID;

  try {
    const user = await User.findById(userID);
    const newProduct = user.cart.filter(
      (product) => product.cardID != req.body.id
    );
    user.cart = newProduct;
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/add-product", auth, async (req, response) => {
  // card-id + quantity
  const userID = req.userID;

  try {
    const user = await User.findById(userID);

    const productID = user.cart.find(
      (product) => product.cardID === req.body.cardID
    );

    if (productID) {
      const priviousQun = productID.quantity;
      const index = user.cart.indexOf(productID);
      user.cart[index] = {
        cardID: req.body.cardID,
        quantity: req.body.quantity + priviousQun,
      };
      await user.save();
      response.status(200).send(user);
      return;
    }

    user.cart.push({cardID: req.body.cardID, quantity: req.body.quantity});
    await user.save();

    response.status(200).send(user);
  } catch (err) {
    response.status(500).send(err);
  }
});

module.exports = router;

// router.put("/sum-product", auth, async (req, res) => {
//   // card-id + quantity
//   const userID = req.userID;

//   try {
//     const user = await User.findById(userID);
//     const productID = user.cart.find(
//       (product) => product.cardID === req.body.cardID
//     );

//     const index = user.cart.indexOf(productID);
//     user.cart[index] = {cardID: req.body.cardID, quantity: req.body.quantity};

//     await user.save();

//     res.status(200).send(user);
//   } catch (err) {
//     response.status(500).send(err);
//   }
// });
// router.put("/change-quantity", auth, async (req, res) => {
//   // card-id + quantity
//   const userID = req.userID;

//   try {
//     const user = await User.findById(userID);
//     const productID = user.cart.find(
//       (product) => product.cardID === req.body.cardID
//     );

//     const index = user.cart.indexOf(productID);
//     user.cart[index] = {cardID: req.body.cardID, quantity: req.body.quantity};

//     await user.save();

//     res.status(200).send(user);
//   } catch (err) {
//     response.status(500).send(err);
//   }
// });
