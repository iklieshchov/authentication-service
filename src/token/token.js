const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error');

const tools = {
  readFile: promisify(fs.readFile),
  sign: promisify(jwt.sign),
  verify: promisify(jwt.verify)
};

class Token {
  constructor(config) {
    this.config = config;
    this.privateKey = null;
    this.publicKey = null;
    this.options = {
      algorithm: 'RS256',
      expiresIn: this.config.expiresIn
    };
  }

  async sign(payload) {
    if (!this.privateKey) {
      this.privateKey = await tools
        .readFile(this.config.private)
        .catch(e => {
          throw createError('unable to generate token', e);
        });
    }
    return tools.sign(payload, this.privateKey, this.options)
      .catch(e => {
        throw createError('unable to generate token', e);
      });
  }

  async verify(token) {
    if (!this.publicKey) {
      this.publicKey = await tools
        .readFile(this.config.public)
        .catch(e => {
          throw createError('token expired', e);
        });
    }
    return tools.verify(token, this.publicKey)
      .catch(e => {
        throw createError('token expired', e);
      });
  }
}

module.exports = {
  Token,
  tools
};
