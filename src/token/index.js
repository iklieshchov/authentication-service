const { asClass } = require('awilix');
const { TokenService } = require('./token.service');

const config = {
  tokenService: asClass(TokenService).singleton()
};

module.exports = config;