const { asClass, asValue } = require('awilix');
const { Database } = require('./Database');
const { User } = require('./models/user');

const config = {
  database: asClass(Database).singleton(),
  User: asValue(User)
};

module.exports = config;