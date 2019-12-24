
class ExpressHandlerContext {
  constructor() {
    // req
    this.req = {
      cookies: {},
      body: {},
    };

    // res
    this.send = jest.fn();
    this.json = jest.fn();
    this.res = {
      status: jest.fn()
        .mockReturnValue({
          send: this.send,
          json: this.json
        }),
      cookie: jest.fn(),
      clearCookie: jest.fn()
    }

    // next
    this.next = jest.fn();
  }

  get params() {
    return [this.req, this.res, this.next];
  }

  get response() {
    const httpCode = this.res.status.mock.calls.length > 0
      ? this.res.status.mock.calls[0][0]
      : undefined;
    const send = this.send.mock.calls.length > 0
      ? this.send.mock.calls[0][0]
      : undefined;
    return { httpCode, send };
  }

  get jsonResponse() {
    const httpCode = this.res.status.mock.calls.length > 0
      ? this.res.status.mock.calls[0][0]
      : undefined;
    const json = this.json.mock.calls.length > 0
      ? this.json.mock.calls[0][0]
      : undefined;
    return { httpCode, json };
  }
}

module.exports = {
  ExpressHandlerContext
};