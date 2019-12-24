const config = require('../index');

describe('HTTP DI config', () => {
  it('exists', () => {
    expect(config).toBeDefined();
  });

  it('setup', () => {
    expect(config.router).toBeDefined();
    expect(config.errorHandler).toBeDefined();
    expect(config.server).toBeDefined();
  });
});
