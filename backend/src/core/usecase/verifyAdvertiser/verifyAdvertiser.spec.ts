import {ObjectId} from 'mongodb';
import {
  advertiserRegistrationCollection,
  AdvertiserRegistrationDocument,
} from '../../data/collection/advertiserRegistrationCollection';
import {advertiserRegistrationRepository} from '../../data/repository/advertiserRegistrationRepository';
import {userRepository} from '../../data/repository/userRepository';
import {databaseTest} from '../../test/databaseTest';
import {VerifyAdvertiser} from './verifyAdvertiser';

const {mongoClient: client} = databaseTest();

describe('verifyAdvertiser', () => {
  afterAll(async () => {
    await client.close();
  });

  test(`registered advertiser can be verified`, async () => {
    const findRegistrationByTokenSpy = jest.spyOn(
      advertiserRegistrationRepository,
      'findOneByToken'
    );
    const saveUserSpy = jest.spyOn(userRepository, 'save');

    await advertiserRegistrationCollection.insertOne({
      token: '3a7322df-1ef9-4485-86e0-a2d4a50f3e77',
      name: 'fooCompany',
      _id: new ObjectId(),
      email: 'foo@foo.cz',
      password: 'foo',
      passwordSalt: 'foo',
      verifyUrl: 'https://foo.com/verifyme/',
    } as AdvertiserRegistrationDocument);

    const verifyAdvertiser = new VerifyAdvertiser({
      client,
      advertiserRegistrationRepository,
      userRepository,
    });

    const result = await verifyAdvertiser.execute({
      token: '3a7322df-1ef9-4485-86e0-a2d4a50f3e77',
    });

    expect(findRegistrationByTokenSpy).toBeCalledTimes(1);
    expect(saveUserSpy).toBeCalledTimes(1);
  });

  // test(`non-existing advertiser can not be verified`, () => {});
});
