import {ObjectId} from 'mongodb';
import {
  newJobNotificationConfigCollection,
  NewJobNotificationConfigDocument,
} from '../../data/collection/newJobNotificationConfigCollection';
import {NewJobNotificationConfigRepository} from '../../data/repository/newJobNotificationConfigRepository';
import {assertResultDto} from '../../shared/dto';
import {databaseTest} from '../../test/databaseTest';
import {UnsubscribeFromNewJobNotification} from './unsubscribeFromNewJobNotification';

const {mongoClient: client} = databaseTest();

describe(`saveNewJobNotificationConfig`, () => {
  afterAll(async () => {
    await client.close();
  });
  test(`Valid job filter can be saved`, async () => {
    const newJobNotificationConfigRepository =
      new NewJobNotificationConfigRepository(client);
    const userId = new ObjectId();
    const deleteNewJobNotificationConfig =
      new UnsubscribeFromNewJobNotification({
        authorizer: {
          unsubscribeFromNewJobNotification: () => true,
        },
        newJobNotificationConfigRepository,
      });
    await newJobNotificationConfigCollection.insertOne({
      userId: userId,
    } as NewJobNotificationConfigDocument);

    const ucResult = await deleteNewJobNotificationConfig.execute({
      userId: userId.toString(),
    });

    assertResultDto(ucResult);
    const dbResult = await newJobNotificationConfigRepository.findOneByUserId(
      userId
    );
    expect(dbResult).toBeNull();
  });
});
