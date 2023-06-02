import {ObjectId} from 'mongodb';
import {
  newJobNotificationConfigCollection,
  NewJobNotificationConfigDocument,
} from '../../data/collection/newJobNotificationConfigCollection';
import {NewJobNotificationConfigRepository} from '../../data/repository/newJobNotificationConfigRepository';
import {databaseTest} from '../../test/databaseTest';
import {GetNewJobNotificationConfig} from './getNewJobNotificationConfig';

const {mongoClient: client} = databaseTest();

describe(`getNewJobNotificationConfig`, () => {
  afterAll(async () => {
    await client.close();
  });

  test(`can get new job notification config of user`, async () => {
    const userId = new ObjectId();
    await newJobNotificationConfigCollection.insertOne({
      _id: new ObjectId(),
      userId,
    } as NewJobNotificationConfigDocument);

    const newJobNotificationConfigRepository =
      new NewJobNotificationConfigRepository(client);

    const getNewJobNotificationConfig = new GetNewJobNotificationConfig({
      authorizer: {
        getNewJobNotificationConfig: () => true,
      },
      newJobNotificationConfigRepository,
    });

    const result = await getNewJobNotificationConfig.execute({
      userId: userId.toString(),
    });

    expect(result).toBeTruthy();
  });
});
