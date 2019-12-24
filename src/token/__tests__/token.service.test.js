const { TokenService } = require('../token.service');
const { Token } = require('../token');

describe('TokenService', () => {

  const config = {
    tokens: {
      access: {
        path: '/path/to/access',
        private: 'access.key',
        public: 'access.pem',
        expiresIn: '5s'
      },
      refresh: {
        path: '/path/to/refresh',
        private: 'refresh.key',
        public: 'refresh.pem',
        expiresIn: '15s'
      }
    }
  };

  it('exists', () => {
    expect(TokenService).toBeDefined();
  });

  it('config', () => {
    // setup
    const service = new TokenService({ config });

    // assert
    expect(service.access).toBeInstanceOf(Token);
    expect(service.access.config).toEqual(config.tokens.access);
    expect(service.access.options).toEqual({
      algorithm: 'RS256',
      expiresIn: '5s'
    });
    
    expect(service.refresh).toBeInstanceOf(Token);
    expect(service.refresh.config).toEqual(config.tokens.refresh);
    expect(service.refresh.options).toEqual({
      algorithm: 'RS256',
      expiresIn: '15s'
    });
  })
});
