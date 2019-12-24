const { Token } = require('./token');

class TokenService {
  constructor({ config }) {
    this.access = new Token(config.tokens.access);
    this.refresh = new Token(config.tokens.refresh);
  }
};

module.exports = {
  TokenService
};
