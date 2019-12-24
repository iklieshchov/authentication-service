const { when } = require('jest-when');
const { UserRepository } = require('../user.repository');

const User = {
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn()
};

describe('UserRepository', () => {

  let repository;

  beforeEach(() => {
    // clear mocks
    User.create.mockClear();
    User.findOne.mockClear();
    User.findOneAndUpdate.mockClear();
    // create repository
    repository = new UserRepository({ User });
  });

  it('exists', () => {
    expect(UserRepository).toBeDefined();
  });

  it('create user', async () => {
    // setup
    const payload = { user: '42' };
    // action
    await repository.create(payload);
    // assert
    expect(User.create).toHaveBeenCalledWith(payload);
  });

  it('search by username', async () => {
    // setup
    when(User.findOne)
      .calledWith({ username: 'name'})
      .mockReturnValue({ lean() { return { user: '42' } } });
    // action
    const result = await repository.byUsername('name');
    // assert
    expect(result).toEqual({ user: '42' });
  });

  it('search by id', async () => {
    // setup
    when(User.findOne)
      .calledWith({ hash: '123'})
      .mockReturnValue({ lean() { return { user: '42' } } });
    // action
    const result = await repository.byId('123');
    // assert
    expect(result).toEqual({ user: '42' });
  });

  it('save user', async () => {
    // setup
    const user = { hash: '42', username: 'name' };
    // action
    await repository.save(user);
    // assert
    expect(User.findOneAndUpdate).toHaveBeenCalled();
    const [query, data] = User.findOneAndUpdate.mock.calls[0];
    expect(query).toEqual({ hash: '42' });
    expect(data).toEqual(user);
  });
});
