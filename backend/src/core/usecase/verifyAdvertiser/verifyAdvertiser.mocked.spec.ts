import { ObjectId } from 'mongodb';
import { advertiserRegistrationRepository } from '../../data/repository/advertiserRegistrationRepository';
import { userRepository } from '../../data/repository/userRepository';
import { AdvertiserRegistration } from '../../domain/advertiserRegistration/advertiserRegistration';
import { VerifyAdvertiser } from './verifyAdvertiser';

// Mocking demo
describe.skip('verifyAdvertiser', () => {
  test(`registered advertiser can be verified`, async () => {
    advertiserRegistrationRepository.findOneByToken = jest.fn(async token => {
      return new AdvertiserRegistration({
        _id: new ObjectId(),
        name: 'neco',
        email: 'foo@foo.cz',
        password: 'foo',
        passwordSalt: 'foo',
        token: 'foo',
        verifyUrl: 'https://foo.com/verifyme/',
      });
    });

    userRepository.save =jest.fn(async user => {
        return null as any;
      }),

    const verifyAdvertiser = new VerifyAdvertiser();

    await verifyAdvertiser.execute({
      token: '3a7322df-1ef9-4485-86e0-a2d4a50f3e77',
    });

    expect(advertiserRegistrationRepository.findOneByToken).toBeCalledTimes(1);
    expect(advertiserRegistrationRepository.findOneByToken).toBeCalledWith(
      '3a7322df-1ef9-4485-86e0-a2d4a50f3e77'
    );
    expect(userRepository.save).toBeCalledTimes(1);
  });

  // test(`non-existing advertiser can not be verified`, () => {});
});
