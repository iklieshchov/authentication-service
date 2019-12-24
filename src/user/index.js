const { asClass } = require('awilix');
const { UserService } = require('./user.service');
const { UserRepository } = require('./user.repository');

const config = {
  userRepository: asClass(UserRepository).singleton(),
  userService: asClass(UserService).singleton()
};

module.exports = config;
