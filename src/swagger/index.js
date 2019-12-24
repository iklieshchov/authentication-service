const { asValue } = require('awilix');
const { swaggerSpec, swaggerSpecHandler } = require('./swaggerSpecHandler');

const config = {
  swaggerSpec: asValue(swaggerSpec),
  swaggerSpecHandler: asValue(swaggerSpecHandler)
};

module.exports = config;