const validator = require('validator');
const { verifyPassword } = require('./password-hashing');

const MIN_USERNAME_LEN = 6;
const MIN_PASSWORD_LEN = 6;

const assertUsername = (username = '') => {
  if (!validator.isLength(username, MIN_USERNAME_LEN)) {
    throw new Error(`username must be at least ${MIN_USERNAME_LEN} characters long`);
  }
};

const assertPassword = (password = '') => {
  if (!validator.isLength(password, MIN_PASSWORD_LEN)) {
    throw new Error(`password must be at least ${MIN_PASSWORD_LEN} characters long`);
  }
};

const assertEmail = (email = '') => {
  if (!validator.isEmail(email)) {
    throw new Error(`invalid email`)
  }
};

const passwordMatch = async (password, hash) => {
  return verifyPassword(password, hash);
};

const assertUser = user => {
  assertUsername(user.username);
  assertPassword(user.password);
  assertEmail(user.email);
};

module.exports = {
  assertUsername,
  assertPassword,
  assertEmail,
  assertUser,
  passwordMatch
};
