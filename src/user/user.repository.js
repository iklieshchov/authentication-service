
class UserRepository {
  constructor({ User }) {
    this.User = User;
  }

  async create(user) {
    return this.User.create(user);
  }

  async byUsername(username) {
    return this.User.findOne({ username }).lean();
  }

  async byId(id) {
    return this.User.findOne({ hash: id }).lean();
  }

  async save(user) {
    return this.User.findOneAndUpdate({ hash: user.hash }, user);
  }
}

module.exports = {
  UserRepository
};
