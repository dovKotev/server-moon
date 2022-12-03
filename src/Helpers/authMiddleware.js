const {verificationTokenFromUser} = require("./token");

function auth(req, res, next) {
  const tokenFromClient = req.header("token");
  if (!tokenFromClient)
    return res.status(401).send("You hav'nt authorization no token");

  const userData = verificationTokenFromUser(tokenFromClient);
  if (!userData) return res.status(401).send("Your token not valid");

  req.userID = userData._id;
  req.admin = userData.biz;

  next();
}

module.exports = auth;
