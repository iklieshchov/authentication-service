const swaggerJSDoc = require('swagger-jsdoc');
const { swaggerDefinition } = require('./swaggerDefinition');

const options = {
  swaggerDefinition,
  apis: ['/src/**/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerSpecHandler = (_, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
};

module.exports = {
  swaggerSpec,
  swaggerSpecHandler
};
