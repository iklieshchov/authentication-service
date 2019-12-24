const config = require('../index');

describe('Token DI config', () => {
  it('exists', () => {
    expect(config).toBeDefined();
  });

  it('setup', () => {
    expect(config.tokenService).toBeDefined();
  });
});
