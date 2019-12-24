const createError = (msg, original) => {
  try {
    const err = new Error(msg);
    err.original = original;
    return err;
  } catch(e) {
    console.log(e);
  }
};

module.exports = {
  createError
};
