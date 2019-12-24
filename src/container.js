const { createContainer, asClass, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const container = createContainer();

// common
container.register({
  config: asValue(require('./config')),
  container: asValue(scopePerRequest(container)),
  app: asClass(require('./app')).singleton()
});

container.register(require('./swagger'));
container.register(require('./http'));
container.register(require('./database'));
container.register(require('./token'));
container.register(require('./user'));

module.exports = container;
