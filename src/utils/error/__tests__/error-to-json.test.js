const { createError } = require('../create-error');
const { errorToJSON } = require('../error-to-json');

describe('wrapError', () => {
  it('exists', () => {
    expect(errorToJSON).toBeDefined();
  });

  it('errorToJSON', () => {
    // setup
    const original = new Error('original error');
    const error = createError('brief error', original);

    // assert
    const result = JSON.stringify({
      error: 'brief error',
      original: {
        error: 'original error'
      }
    });
    expect(errorToJSON(error)).toEqual(result);
  });
});
