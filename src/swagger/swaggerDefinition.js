

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Authentication (Service)',
    version: '1.0.0',
    description: 'Provide user authentication/re-authentication with jwt tokens'
  },
  host: 'localhost:3000',
  basePath: '/'
};

module.exports = {
  swaggerDefinition
};
