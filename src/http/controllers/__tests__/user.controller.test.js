const { when } = require('jest-when');

const UserController = require('../user.controller');
const { ExpressHandlerContext } = require('../../../utils/testing/express-handler-context');

class UserService {
  constructor() {
    this.create = jest.fn();
    this.authenticate = jest.fn();
    this.refreshAuthentication = jest.fn();
    this.about = jest.fn();
  }
}

describe('UserController', () => {

  let userService;
  let context;

  beforeEach(() => {
    userService = new UserService();
    context = new ExpressHandlerContext();
  });

  it('UserController', () => {
    // asserts
    expect(UserController).toBeDefined();
    expect(UserController.router).toBeDefined();

    expect(UserController.signup).toBeDefined();
    expect(UserController.login).toBeDefined();
    expect(UserController.refresh).toBeDefined();
    expect(UserController.logout).toBeDefined();
    expect(UserController.me).toBeDefined();
  });

  it('router', () => {
    // setup
    const paths = UserController.router.stack.map(layer => layer.route.path);
    // assert
    expect(paths).toContain('/signup');
    expect(paths).toContain('/login');
    expect(paths).toContain('/refresh');
    expect(paths).toContain('/logout');
    expect(paths).toContain('/me');
  });

  it('signup', async () => {
    // setup
    const handler = UserController.signup({ userService });

    when(userService.create)
      .calledWith({
        username: 'john',
        email: 'email@mail.com',
        password: '123'
      })
      .mockResolvedValue();
    context.req.body.username = 'john';
    context.req.body.email = 'email@mail.com';
    context.req.body.password = '123';

    // action
    await expect(handler(...context.params))
      .resolves.not.toThrow();

    const { httpCode, send } = context.response;
    expect(httpCode).toEqual(201);
    expect(send).not.toBeDefined();
  });

  it('signup failed', async () => {
    // setup
    const errorMgs = 'invalid data';
    const handler = UserController.signup({ userService });
    userService.create
      .mockImplementation(() => {
        throw new Error(errorMgs);
      });

    // action+assert
    await expect(handler(...context.params))
      .rejects.toThrow(errorMgs);
  });

  it('login', async () => {
    // setup
    const handler = UserController.login({ userService });

    when(userService.authenticate)
      .calledWith('john', '123')
      .mockResolvedValue([ 'access', 'refresh' ]);
    context.req.body.username = 'john';
    context.req.body.password = '123';

    // action
    await expect(handler(...context.params))
      .resolves.not.toThrow();
    
    // assert
    const [ aName, authToken ] = context.res.cookie.mock.calls
      .find(c => c[0] === 'Authorization');
    expect(authToken).toEqual('access');

    const [ fName, refreshToken, options ] = context.res.cookie.mock.calls
      .find(c => c[0] === 'Refresh');
    expect(refreshToken).toEqual('refresh');
    expect(options.httpOnly).toBeTruthy();

    const { httpCode, send } = context.response;
    expect(httpCode).toEqual(204);
    expect(send).not.toBeDefined();
  });

  it('login failed', async () => {
    // setup
    const errorMgs = 'username or password';
    const handler = UserController.login({ userService });
    userService.authenticate
      .mockImplementation(() => {
        throw new Error(errorMgs);
      });

    // action+assert
    await expect(handler(...context.params))
      .rejects.toThrow(errorMgs);
  });

  it('refresh', async () => {
    // setup
    const handler = UserController.refresh({ userService });

    when(userService.refreshAuthentication)
      .calledWith('refresh-token')
      .mockResolvedValue([ 'access', 'refresh' ]);
    context.req.cookies.Refresh = 'refresh-token';

    // action
    await expect(handler(...context.params))
      .resolves.not.toThrow();
    
    // assert
    const [ aName, authToken ] = context.res.cookie.mock.calls
      .find(c => c[0] === 'Authorization');
    expect(authToken).toEqual('access');

    const [ fName, refreshToken, options ] = context.res.cookie.mock.calls
      .find(c => c[0] === 'Refresh');
    expect(refreshToken).toEqual('refresh');
    expect(options.httpOnly).toBeTruthy();

    const { httpCode, send } = context.response;
    expect(httpCode).toEqual(204);
    expect(send).not.toBeDefined();
  });

  it('refresh failed', async () => {
    // setup
    const errorMgs = 'invalid';
    const handler = UserController.refresh({ userService });
    userService.refreshAuthentication
      .mockImplementation(() => {
        throw new Error(errorMgs);
      });

    // action+assert
    await expect(handler(...context.params))
      .rejects.toThrow(errorMgs);
  });

  it('logout', async () => {
    // setup
    const handler = UserController.logout({ });

    // action
    await handler(...context.params);

    // asserts
    expect(context.res.clearCookie).toHaveBeenCalledTimes(2);
    const resetAuthorization = context.res.clearCookie.mock.calls
      .find(c => c[0] === 'Authorization');
    const resetRefresh = context.res.clearCookie.mock.calls
      .find(c => c[0] === 'Refresh');
    expect(resetAuthorization).toBeDefined();
    expect(resetRefresh).toBeDefined();

    const { httpCode, send } = context.response;
    expect(httpCode).toEqual(204);
    expect(send).toBeUndefined();
  });

  it('me', async () => {
    // setup
    const user = { username: 'John Doe' };
    const handler = UserController.me({ userService });

    when(userService.about)
      .calledWith('123')
      .mockResolvedValue(user);
    context.req.userId = '123';

    // action
    await handler(...context.params);

    // asserts
    const { httpCode, json } = context.jsonResponse;
    expect(httpCode).toEqual(200);
    expect(json).toEqual(user);
  });

  it('me failed', async () => {
    // setup
    userService.about
      .mockImplementation(() => {
        throw new Error('user not found');
      });
    const handler = UserController.me({ userService });
    
    // action
    await expect(handler(...context.params))
      .rejects.toThrow('user not found');
  });
});
