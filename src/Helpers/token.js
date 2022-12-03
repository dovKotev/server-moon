const jwt = require("jsonwebtoken");

function generateToken(user) {
  const token = jwt.sign({_id: user._id, biz: user.biz}, "keyOfBears");
  return token;
}

function verificationTokenFromUser(token) {
  try {
    const userData = jwt.verify(token, "keyOfBears");
    return userData;
  } catch {
    return null;
  }
}

module.exports = {generateToken, verificationTokenFromUser};
