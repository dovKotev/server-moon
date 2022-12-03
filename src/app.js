const express = require("express");
const app = express();

require("dotenv").config();

const cors = require("cors");
const morgan = require("morgan");

require("./Helpers/connectMongoDB");
const users = require("./users/routes/routes");
const cards = require("./cards/routes/routes");

app.use(express.json());
app.use(cors());
app.use(morgan());

app.use("/api/users", users);
app.use("/api/cards", cards);

const PORT = process.env.PORT || 3001;

app.listen(PORT, console.log(`server run on: localhost ${PORT}`));
