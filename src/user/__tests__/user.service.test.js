const { UserService } = require('../user.service');
const { hashPassword } = require('../utils/password-hashing');

const { when } = require('jest-when');

const tokenService = {
  access: {
    sign: jest.fn(),
    verify: jest.fn()
  },
  refresh: {
    sign: jest.fn(),
    verify: jest.fn()
  }
};

const userRepository = {
  create: jest.fn(),
  byUsername: jest.fn(),
  byId: jest.fn(),
  save: jest.fn()
};

const genUser = () => ({
  username: 'John Doe',
  email: 'john@mail.com',
  password: '12345678'
});

describe('UserService', () => {

  let service;

  beforeEach(() => {
    // reset mocks
    tokenService.access.sign.mockClear();
    tokenService.access.verify.mockClear();
    tokenService.refresh.sign.mockClear();
    tokenService.refresh.verify.mockClear();
    
    userRepository.create.mockClear();
    userRepository.byUsername.mockClear();
    userRepository.byId.mockClear();
    userRepository.save.mockClear();

    // create service
    service = new UserService({ tokenService, userRepository });
  });

  it('exists', () => {
    expect(UserService).toBeDefined();
  });

  it('create user', async () => {
    // setup
    const user = genUser();
    when(userRepository.byUsername)
      .calledWith(user.username)
      .mockReturnValue(null);

    // action
    await expect(service.create(user)).resolves.not.toThrow();

    // asserts
    expect(userRepository.byUsername).toHaveBeenCalledTimes(1);
    expect(userRepository.create).toHaveBeenCalledTimes(1);

    const data = userRepository.create.mock.calls[0][0];
    expect(data.username).toEqual(user.username);
    expect(data.email).toEqual(user.email);
    expect(data.password).not.toEqual(user.password);
    expect(data.hash).toBeDefined();
  });

  it('user exist on create', async () => {
    // setup
    userRepository.byUsername
      .mockReturnValue(genUser());

    // action + assert
    await expect(service.create(genUser())).rejects.toThrow();
  });

  it('invalid user payload', async () => {
    // case 1
    let user = genUser();
    user.username = '';
    await expect(service.create(user)).rejects
      .toThrow('username must be at least 6 characters long');
    
    // case 2
    user = genUser();
    user.email = 'not-valid';
    await expect(service.create(user)).rejects
      .toThrow('invalid email');

    // case 3
    user = genUser();
    user.password = '';
    await expect(service.create(user)).rejects
      .toThrow('password must be at least 6 characters long');
  });

  it('authenticate', async () => {
    // setup
    const user = genUser();
    user.hash = '123';
    user.password = await hashPassword(user.password);
    when(userRepository.byUsername)
      .calledWith(user.username)
      .mockReturnValue(user);

    // actions + assert
    await expect(service.authenticate('John Doe', '12345678'))
      .resolves.not.toThrow();

    const payloadForTokens = {
      id: user.hash
    };
    expect(tokenService.access.sign).toHaveBeenCalledWith(payloadForTokens);
    expect(tokenService.refresh.sign).toHaveBeenCalledWith(payloadForTokens);
  });

  it('authentication failed', async () => {
    // setup
    const user = genUser();
    const password = user.password;
    user.password = await hashPassword(password);
    
    // case 1: not valid username/password
    // asserts
    await expect(service.authenticate('', '12345678'))
      .rejects.toThrow('username must be at least 6 characters long');
    await expect(service.authenticate('John Doe', ''))
      .rejects.toThrow('password must be at least 6 characters long');

    // case 2: user not exists
    // setup
    when(userRepository.byUsername)
      .calledWith(user.username)
      .mockImplementation(null);
    // asserts
    await expect(service.authenticate(user.username, password))
      .rejects.toThrow('username or password is incorrect');

    // case 3: invalid password
    // setup
    when(userRepository.byUsername)
      .calledWith(user.username)
      .mockImplementation(user);
    // assert
    await expect(service.authenticate(user.username, '87654321'))
      .rejects.toThrow('username or password is incorrect');
  });

  it('refreshAuthentication', async () => {
    // setup
    const user = genUser();
    user.hash = '123';

    when(tokenService.refresh.verify)
      .calledWith('refresh')
      .mockReturnValue({ id: '123' });
    when(userRepository.byId)
      .calledWith('123')
      .mockImplementation(user);

    // action + asserts
    await expect(service.refreshAuthentication('refresh'))
      .resolves.not.toThrow();

    const payloadForTokens = {
      id: user.hash
    };
    expect(service.tokenService.access.sign).toHaveBeenCalledWith(payloadForTokens);
    expect(service.tokenService.refresh.sign).toHaveBeenCalledWith(payloadForTokens);
  });

  it('refreshAuthentication failed', async () => {
    // setup
    when(tokenService.refresh.verify)
      .calledWith('refresh')
      .mockImplementation(Promise.reject(new Error('failed')));
    
    // action + assert
    await expect(service.refreshAuthentication('refresh'))
      .rejects.toThrow('failed');
  });

  it('refreshAuthentication valid but missing user', async () => {
    // setup
    when(tokenService.refresh.verify)
      .calledWith('refresh')
      .mockReturnValue({ id: '123' });
    when(userRepository.byId)
      .calledWith('123')
      .mockImplementation(null);

    await expect(service.refreshAuthentication('refresh'))
      .rejects.toThrow('user not found');
  });

  it('about', async () => {
    // setup
    const user = genUser();
    user.hash = '123';
    when(userRepository.byId)
      .calledWith('123')
      .mockImplementation(user);

    // action
    const result = await service.about('123');
    expect(result).toEqual({
      id: user.hash,
      username: user.username,
      email: user.email
    });
  });

  it('about user not found', async () => {
    // setup
    when(userRepository.byId)
      .calledWith('123')
      .mockImplementation(null);
    
    // action + assert
    await expect(service.about('123'))
      .rejects.toThrow('user not found');
  });
});
