const { Token, tools } = require('../token');

describe('Token', () => {

  const config = {
    path: '/path/to/cert',
    private: 'private.key',
    public: 'public.pem'
  };
  let token;

  beforeEach(() => {
    token = new Token(config);
  });

  it('exists', () => {
    expect(Token).toBeDefined();
  });

  it('config', () => {
    // assert
    expect(token.config).toEqual(config);
    expect(token.privateKey).toBeNull();
    expect(token.publicKey).toBeNull();

    expect(token.sign).toBeInstanceOf(Function);
    expect(token.verify).toBeInstanceOf(Function);
  });

  it('sign token', async () => {
    // setup
    tools.readFile = jest.fn()
      .mockImplementation(_ => Promise.resolve('cert-content'));
    tools.sign = jest.fn()
      .mockImplementation(_ => Promise.resolve('result'));

    // action
    const result = await token.sign({ id: 42 });

    // assert
    expect(result).toEqual('result');
    expect(tools.readFile).toHaveBeenCalledTimes(1);
    expect(tools.sign).toHaveBeenCalledTimes(1);
    expect(token.privateKey).toEqual('cert-content');

    // setup
    tools.readFile.mockClear();
    tools.sign.mockClear();

    // action
    await token.sign({ id: 42 });

    // assert
    expect(tools.readFile).toHaveBeenCalledTimes(0);
    expect(tools.sign).toHaveBeenCalledTimes(1);
    expect(token.privateKey).toEqual('cert-content');
  });

  it('verify token', async () => {
    // setup
    tools.readFile = jest.fn()
      .mockImplementation(_ => Promise.resolve('cert-content'));
    tools.verify = jest.fn()
      .mockImplementation(_ => Promise.resolve('ok'));

    // action
    const result = await token.verify('token');

    // assert
    expect(result).toEqual('ok');
    expect(tools.readFile).toHaveBeenCalledTimes(1);
    expect(tools.verify).toHaveBeenCalledTimes(1);
    expect(token.publicKey).toEqual('cert-content');

    // setup
    tools.readFile.mockClear();
    tools.verify.mockClear();

    // action
    await token.verify('token');

    // assert
    expect(tools.readFile).toHaveBeenCalledTimes(0);
    expect(tools.verify).toHaveBeenCalledTimes(1);
    expect(token.publicKey).toEqual('cert-content');
  });

  it('token generation error', async () => {
    // setup for certificate file not found
    tools.readFile = jest.fn()
      .mockImplementation(_ => Promise.reject(new Error('file not found')));
    
    // action + assert
    await token.sign({ id: 42 })
      .catch(e => {
        expect(e).toEqual(new Error('unable to generate token'));
        expect(e.original).toEqual(new Error('file not found'));
      });
    await token.verify('token')
      .catch(e => {
        expect(e).toEqual(new Error('token expired'));
        expect(e.original).toEqual(new Error('file not found'));
      });

    // setup for sign/verify failed
    tools.readFile = jest.fn()
      .mockImplementation(_ => Promise.resolve('content'));
    tools.sign = jest.fn()
      .mockImplementation(_ => Promise.reject({ failed: 'reason' }));
    tools.verify = jest.fn()
      .mockImplementation(_ => Promise.reject({ failed: 'reason' }));

    // action + assert
    await token.sign({ id: 42 })
      .catch(e => {
        expect(e).toEqual(new Error('unable to generate token'));
        expect(e.original).toEqual({ failed: 'reason' });
      });
    await token.verify('token')
      .catch(e => {
        expect(e).toEqual(new Error('token expired'));
        expect(e.original).toEqual({ failed: 'reason' });
      });
  });
});