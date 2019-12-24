const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  hash: { type: String, unique: true, index: true },
  username: { type: String, unique: true, index: true },
  email: { type: String },
  password: { type: String }
});

module.exports = {
  User: model('User', userSchema)
};
