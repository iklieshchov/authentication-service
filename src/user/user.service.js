const { assertUsername, assertPassword, passwordMatch, assertUser } = require('./utils/validation');
const { userPayloadFilter, userAboutFilter } = require('./utils/filters');
const { hashPassword } = require('./utils/password-hashing');
const { createError } = require('../utils/error');
const nanoid = require('nanoid');

const loginErrorMsg = 'username or password is incorrect';
const userNotFoundMsg = 'user not found';

class UserService {
  constructor({ tokenService, userRepository }) {
    this.tokenService = tokenService;
    this.userRepository = userRepository;
  }

  async create(payload) {
    assertUser(payload);
    const user = { ...payload };

    const exists = await this.userRepository.byUsername(user.username);
    if (exists) {
      throw new Error('username is already taken');
    }
    
    user.hash = nanoid();
    user.password = await hashPassword(user.password);
    
    await this.userRepository.create(user);
  }

  async authenticate(username, password) {
    assertUsername(username);
    assertPassword(password);

    const user = await this.userRepository.byUsername(username);
    if (!user) {
      throw new Error(loginErrorMsg);
    }
    await passwordMatch(password, user.password)
      .catch(err => {
        throw createError(loginErrorMsg, err)
      });

    const payload = userPayloadFilter(user);

    return [
      await this.tokenService.access.sign(payload),
      await this.tokenService.refresh.sign(payload)
    ];
  }

  async refreshAuthentication(refreshToken) {
    let payload = await this.tokenService.refresh.verify(refreshToken);
    const user = await this.userRepository.byId(payload.id);

    if (!user) {
      throw new Error(userNotFoundMsg);
    }

    payload = userPayloadFilter(user);

    return [
      await this.tokenService.access.sign(payload),
      await this.tokenService.refresh.sign(payload)
    ];
  }
  
  async about(id) {
    const user = await this.userRepository.byId(id);
    if (!user) {
      throw new Error(userNotFoundMsg);
    }
    return userAboutFilter(user);
  }
}

module.exports = {
  UserService
};
