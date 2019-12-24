const config = require('../index');

describe('Swagger DI config', () => {
  it('exists', () => {
    expect(config).toBeDefined();
  });

  it('setup', () => {
    expect(config.swaggerSpec).toBeDefined();
    expect(config.swaggerSpecHandler).toBeDefined();
  });
});
