const config = require('../index');

describe('Database DI config', () => {
  it('exists', () => {
    expect(config).toBeDefined();
  });

  it('setup', () => {
    expect(config.database).toBeDefined();
    expect(config.User).toBeDefined();
  });
});
