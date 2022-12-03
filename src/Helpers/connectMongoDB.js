const mongoose = require("mongoose");

const uri =
  "mongodb+srv://dovi:dh554433@cluster0.jgrorhg.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("The DataBAse is working!"))
  .catch((err) => console.log(err));

// "mongodb://localhost/moon_shop_app"
