const { asyncHandler } = require('../async-handler');

describe('async-handler', () => {
  it('exists', () => {
    expect(asyncHandler).toBeDefined();
  });

  it('perform handler', async() => {
    // setup
    const handler = jest.fn();
    
    // action
    const asHandler = asyncHandler(handler);
    await asHandler();
    
    // assert
    expect(handler).toHaveBeenCalled();
  });

  it('perform handler with error', async() => {
    // setup
    const handler = jest.fn()
      .mockImplementation(() => {
        throw new Error('my error');
      });
    const req = {};
    const res = {};
    const next = jest.fn();
    
    // action
    const asHandler = asyncHandler(handler);
    await expect(asHandler(req, res, next))
      .rejects.toThrow('my error');
  });
});
