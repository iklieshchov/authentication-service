const { errorToJSON } = require('../utils/error');

const errorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    console.error(errorToJSON(err));
    return res.status(400).json({ reason: err.message });
  }
  console.error(JSON.stringify({ unknown: err }));
  res.status(500).json({ reason: 'unknown' })
};

module.exports = { 
  errorHandler
};
