
const asyncHandler = handler => async (req, res, next) => {
  return Promise
    .resolve(await handler(req, res, next))
    .catch(next);
};

module.exports = { asyncHandler };
