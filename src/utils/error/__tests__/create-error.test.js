const { createError } = require('../create-error');

describe('wrapError', () => {
  it('exists', () => {
    expect(createError).toBeDefined();
  });

  it('createError', () => {
    // setup
    const original = new Error('original error');
    const error = createError('brief error', original);

    // assert
    expect(error).toEqual(new Error('brief error'));
    expect(error.original).toEqual(original);
  });
});
