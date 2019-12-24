const { asClass, asFunction, asValue } = require('awilix');

const { router } = require('./router');
const { errorHandler } = require('./error-handler');
const { Server } = require('./server');

const config = {
  router: asFunction(router).singleton(),
  errorHandler: asValue(errorHandler),
  server: asClass(Server).singleton()
};

module.exports = config;
