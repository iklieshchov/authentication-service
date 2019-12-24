const { asyncHandler } = require('../utils/async-handler');
const { inject } = require('awilix-express');

const authenticated = ({ tokenService }) => {
  return asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies.Authorization;
    const payload = await tokenService.access.verify(accessToken);
    req.userId = payload.id;
    next();
  });
};

module.exports = {
  authenticated
};
