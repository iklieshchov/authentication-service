const { Server } = require('../server');

describe('Server', () => {
  it('exists', () => {
    expect(Server).toBeDefined();
  });

  it('configured', () => {
    // setup
    const config = {};
    const router = jest.fn();
    const server = new Server({ config, router });
    // assert
    expect(server.config).toEqual(config);
    expect(server.express).toBeDefined();
    expect(server.start).toBeDefined();
  });
})
