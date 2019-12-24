const path = require('path');

const loadController = controllerUri => {
  const controllerPath = path.join('../controllers', controllerUri);
  const Controller = require(controllerPath);
  return Controller.router;
};

module.exports = {
  loadController
};
