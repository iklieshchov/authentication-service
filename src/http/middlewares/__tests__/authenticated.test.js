const { authenticated } = require('../authenticated');
const { when } = require('jest-when');

const tokenService = {
  access: {
    verify: jest.fn()
  }
};

describe('authenticated middleware', () => {
  
  beforeEach(() => {
    tokenService.access.verify.mockClear();
  });

  it('exists', () => {
    expect(authenticated).toBeDefined();
  });

  it('valid token', async () => {
    // setup
    when(tokenService.access.verify)
      .calledWith('valid-token')
      .mockReturnValue({ id: '42' });
    const req = {
      cookies: {
        Authorization: 'valid-token'
      }
    };
    const res = {};
    const next = jest.fn();
    
    // action
    const handler = authenticated({ tokenService });
    await handler(req, res, next);

    // assert
    expect(req.userId).toEqual('42');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('invalid token', async () => {
    // setup
    tokenService.access.verify
      .mockImplementation(() => {
        throw new Error('not authorized');
      });
    const req = {
      cookies: {
        Authorization: 'valid-token'
      }
    };
    const res = {};
    const next = jest.fn();

    // action
    const handler = authenticated({ tokenService });
    await expect(handler(req, res, next))
      .rejects.toThrow('not authorized');

    expect(res.userId).toBeUndefined();
    expect(next).not.toBeCalled();
  });
});
