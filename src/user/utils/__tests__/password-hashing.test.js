const { hashPassword, verifyPassword } = require('../password-hashing');

describe('Password Hashing', () => {
  it('exists', () => {
    expect(hashPassword).toBeDefined();
    expect(verifyPassword).toBeDefined();
  });

  it('hash/verify password', async () => {
    // setup
    const password = '12345678';
    // action
    const hash = await hashPassword(password);
    // action+assert
    expect(password).not.toEqual(hash);
    await expect(verifyPassword(password, hash))
      .resolves.toEqual(true);
  });

  it('verify errors', async () => {
    // setup
    const password = '12345678';
    const invalidHash = '123';

    // action
    try {
      await verifyPassword(password, invalidHash);
    } catch(err) {

      // asserts
      expect(err.message).toEqual('invalid password');
      expect(err.original).toBeDefined();
      expect(err.original.message).toEqual('not match');
    }
  });
});
