const userPayloadFilter = user => {
  return {
    id: user.hash
  };
};

const userAboutFilter = user => {
  return {
    id: user.hash,
    username: user.username,
    email: user.email
  }
};

module.exports = {
  userPayloadFilter,
  userAboutFilter
};
