import {ObjectId} from 'mongodb';
import {v4} from 'uuid';
import {
  forgottenPasswordRequestCollection,
  ForgottenPasswordRequestDocument,
} from '../../data/collection/forgottenPasswordRequestCollection';
import {
  userCollection,
  UserDocument,
} from '../../data/collection/userCollection';
import {databaseTest} from '../../test/databaseTest';
import {ResetForgottenPassword} from './resetForgottenPassword';

const {mongoClient: client} = databaseTest();

// kdyz existuje request v databazi,
// kdyz existuje user v databazi,
// kdyz udelam usecase, userovi se v db zmeni heslo
describe(`resetForgottenPassword`, () => {
  afterAll(async () => {
    await client.close();
  });
  test(`Expect success on valid scenario`, async () => {
    const {resetForgottenPassword, userId, requestId, token} =
      await testSetup();

    const result = await resetForgottenPassword.execute({
      token: token,
      password: `resettedpassword`,
    });

    const updatedUser = await userCollection.findOne({_id: userId});
    // assert updatedUser contain object with updated fields
    expect(updatedUser?.password).toBeTruthy();
    expect(updatedUser?.passwordSalt).toBeTruthy();
  });
});

const testSetup = async () => {
  const userId = new ObjectId();
  const requestId = new ObjectId();
  const token = v4();

  await userCollection.insertOne({
    _id: userId,
  } as UserDocument);
  await forgottenPasswordRequestCollection.insertOne({
    _id: requestId,
    token: token,
    userId,
  } as ForgottenPasswordRequestDocument);

  const resetForgottenPassword = new ResetForgottenPassword();

  return {
    resetForgottenPassword,
    userId,
    requestId,
    token,
  };
};
