import {ObjectId} from 'mongodb';
import {emailChangeRequestCollection} from '../../data/collection/emailChangeRequestCollection';
import {userCollection} from '../../data/collection/userCollection';
import {emailChangeRequestRepository} from '../../data/repository/emailChangeRequestRepository';
import {userRepository} from '../../data/repository/userRepository';
import {databaseTest} from '../../test/databaseTest';
import {VerifyEmailChange} from './verifyEmailChange';

const {mongoClient: client} = databaseTest();

describe('verifyEmailChange', () => {
  afterAll(async () => {
    await client.close();
  });

  test(`registered advertiser can be verified`, async () => {
    const findRegistrationByTokenSpy = jest.spyOn(
      emailChangeRequestRepository,
      'findOneByToken'
    );
    const saveUserSpy = jest.spyOn(userRepository, 'save');
    const userId = new ObjectId();

    await userCollection.insertOne({
      _id: userId,
      email: 'oldemail@gmail.com',
    });

    await emailChangeRequestCollection.insertOne({
      token: '3a7322df-1ef9-4485-86e0-a2d4a50f3e77',
      _id: new ObjectId(),
      userId: userId,
      newEmail: 'newemail@foo.cz',
      verifyEmailUrl: 'https://foo.com/verifyme/',
    });

    const verifyEmailChange = new VerifyEmailChange({
      client,
      emailChangeRequestRepository,
      userRepository,
    });

    const result = await verifyEmailChange.execute({
      token: '3a7322df-1ef9-4485-86e0-a2d4a50f3e77',
    });

    expect(findRegistrationByTokenSpy).toBeCalledTimes(1);
    expect(saveUserSpy).toBeCalledTimes(1);
  });

  // test(`non-existing request can not be verified`, () => {});
});
