const encrypt = require("bcryptjs");

function generatePassword(password) {
  return encrypt.hashSync(password, 10);
}

function compearePassword(password, encryptPassword) {
  return encrypt.compareSync(password, encryptPassword);
}

module.exports = {generatePassword, compearePassword};
