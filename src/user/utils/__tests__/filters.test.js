const { userPayloadFilter, userAboutFilter } = require('../filters');

const user = {
  hash: '42',
  username: 'John Doe',
  email: 'john@mail.com',
  password: 'password-value'
};

describe('User Filters', () => {
  it('exists', () => {
    expect(userPayloadFilter).toBeDefined();
    expect(userAboutFilter).toBeDefined();
  });

  it('userPayloadFilter', () => {
    // action
    const result = userPayloadFilter(user);
    // assert
    expect(result).toEqual({ id: '42' });
  });

  it('userAboutFilter', () => {
    // action
    const result = userAboutFilter(user);
    // assert
    expect(result).toEqual({
      id: '42',
      username: 'John Doe',
      email: 'john@mail.com'
    });
  });
});
