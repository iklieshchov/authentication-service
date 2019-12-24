const config = require('../index');

describe('User DI config', () => {
  it('exists', () => {
    expect(config).toBeDefined();
  });

  it('setup', () => {
    expect(config.userRepository).toBeDefined();
    expect(config.userService).toBeDefined();
  });
});
