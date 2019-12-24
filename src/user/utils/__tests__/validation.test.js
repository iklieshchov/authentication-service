const {
  assertUsername,
  assertPassword,
  assertEmail,
  assertUser,
  passwordMatch } = require('../validation');
const { hashPassword } = require('../password-hashing');

describe('User Validation', () => {
  it('exists', () => {
    expect(assertUsername).toBeDefined();
    expect(assertPassword).toBeDefined();
    expect(assertEmail).toBeDefined();
    expect(assertUser).toBeDefined();
    expect(passwordMatch).toBeDefined();
  });

  it('assertUsername', () => {
    // valid
    expect(() => assertUsername('John Doe')).not.toThrow();
    // invalid
    expect(() => assertUsername('John')).toThrow('username must be at least 6 characters long');
  });

  it('assertPassword', () => {
    // valid
    expect(() => assertPassword('12345678')).not.toThrow();
    // invalid
    expect(() => assertPassword('123')).toThrow('password must be at least 6 characters long');
  });

  it('assertEmail', () => {
    // valid
    expect(() => assertEmail('john@mail.com')).not.toThrow();
    // invalid
    expect(() => assertEmail('mail.com')).toThrow('invalid email');
  });

  it('assertUser', () => {
    // setup
    const genUser = _ => ({
      username: 'John Doe',
      email: 'john@mail.com',
      password: '12345678'
    });

    // assert
    expect(() => assertUser(genUser())).not.toThrow();
    expect(() => assertUser({...genUser(), username: 'John'}))
      .toThrow('username must be at least 6 characters long');
    expect(() => assertUser({...genUser(), email: 'mail.com'}))
      .toThrow('invalid email');
    expect(() => assertUser({...genUser(), password: 'John'}))
      .toThrow('password must be at least 6 characters long');
  });

  it('passwordMatch', async () => {
    // setup
    const password = '12345678';
    const hash = await hashPassword(password);

    // assert
    await expect(passwordMatch(password, hash))
      .resolves.not.toThrow();
    await expect(passwordMatch('123', hash))
      .rejects.toThrow('invalid password');
  });
});
