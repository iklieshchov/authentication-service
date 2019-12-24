const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const { createError } = require('../../utils/error');

const salt = bcrypt.genSaltSync(10);
const invalidPassowrdMsg = 'invalid password';

const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);

const hashPassword = async (password) => {
  return hash(password, salt);
};

const verifyPassword = async (password, hash) => {
  return compare(password, hash)
    .then(match => {
      if (!match) {
        throw new Error('not match');
      }
      return match;
    })
    .catch(err => {
      throw createError(invalidPassowrdMsg, err);
    });
};

module.exports = {
  hashPassword,
  verifyPassword
};
