import {ObjectId} from 'mongodb';
import {
  userCollection,
  UserDocument,
} from '../../data/collection/userCollection';
import {userRepository} from '../../data/repository/userRepository';
import {assertErrorDto} from '../../shared/dto';
import {databaseTest} from '../../test/databaseTest';
import {GetUser} from './getUser';

const {mongoClient: client} = databaseTest();

describe(`updateUser`, () => {
  afterAll(async () => {
    await client.close();
  });
  test(`Expect success on valid scenario`, async () => {
    const {updateUser} = await testSetup();
    const userId = await givenUserExists();
    const saveUserSpy = jest.spyOn(userRepository, 'save');
    const result = await updateUser.execute({
      userId: userId.toString(),
      password: `newpassword`,
    });

    const updatedUser = await userCollection.findOne({_id: userId});
    // assert updatedUser contain object with updated fields
    expect(updatedUser?.password).toBeTruthy();
    expect(updatedUser?.passwordSalt).toBeTruthy();
    expect(saveUserSpy).toHaveBeenCalledTimes(1);
  });

  test(`Expect error when updating non-existing user`, async () => {
    const {updateUser} = await testSetup();
    const result = await updateUser.execute({
      // non-existing userId
      userId: new ObjectId().toString(),
    });
    assertErrorDto(result);
    expect(result.error.type).toBe('NotFoundError');
  });
});

const testSetup = async () => {
  const updateUser = new GetUser({
    authorizer: {
      updateUser: () => true,
    },
  });

  return {
    updateUser,
  };
};

async function givenUserExists() {
  const userId = new ObjectId();
  await userCollection.insertOne({
    _id: userId,
  } as UserDocument);
  return userId;
}
