const errorToObject = err => {
  let original;
  if (err.original) {
    original = errorToObject(err.original);
  }
  return { error: err.message, original };
}

const errorToJSON = err => {
  return JSON.stringify(errorToObject(err));
}

module.exports = {
  errorToJSON
};
