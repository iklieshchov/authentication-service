const { errorHandler } = require('../error-handler');
const { ExpressHandlerContext } = require('../../utils/testing/express-handler-context');

describe('errorHandler', () => {

  let handlerContext;
  let consoleSpy;

  beforeEach(() => {
    handlerContext = new ExpressHandlerContext();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('exists', () => {
    expect(errorHandler).toBeDefined();
  });

  it('error received', () => {
    // acition
    errorHandler(new Error('my error'), ...handlerContext.params);
    // assert
    expect(consoleSpy).toHaveBeenCalledWith("{\"error\":\"my error\"}");
    const { httpCode, json } = handlerContext.jsonResponse;
    expect(httpCode).toEqual(400);
    expect(json.reason).toEqual('my error');
  });

  it('non-error object received', () => {
    // acition
    errorHandler('hello', ...handlerContext.params);
    // assert
    expect(consoleSpy).toHaveBeenCalledWith("{\"unknown\":\"hello\"}");
    const { httpCode, json } = handlerContext.jsonResponse;
    expect(httpCode).toEqual(500);
    expect(json.reason).toEqual('unknown');
  });
});
