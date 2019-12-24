const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const { loadController } = require('./utils/load-controller');

const router = ({ container, errorHandler, swaggerSpec, swaggerSpecHandler }) => {
  const router = Router();
  router.use(container);

  // swagger
  router.get('/swagger.json', swaggerSpecHandler);
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // controllers
  router.use('/api/user', loadController('user.controller'));

  // error handler
  router.use(errorHandler);

  return router;
};

module.exports = {
  router
};
