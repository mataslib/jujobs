import {AdvertiserRegistration} from './advertiserRegistration';

describe('registerAdvertiser', () => {
  test(`Password should be hashed, password salt should be created, verificationUrl should be generated`, async () => {
    const advertiserRegistration = await AdvertiserRegistration.create({
      name: 'some company',
      email: 'someemail@email.com',
      verifyUrl: 'https://verify.me',
      password: 'secretpassword',
    });

    expect(typeof advertiserRegistration.password).toBe('string');
    expect(advertiserRegistration.password).not.toEqual('password');
    expect(typeof advertiserRegistration.passwordSalt).toBe('string');

    expect(advertiserRegistration.verifyUrl).toEqual(
      expect.stringContaining('https://verify.me/')
    );
    expect(advertiserRegistration.verifyUrl.length).toBeGreaterThan(
      'https://verify.me/'.length
    );
  });
});
