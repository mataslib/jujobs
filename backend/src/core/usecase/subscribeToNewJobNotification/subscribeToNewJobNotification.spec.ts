import {ObjectId} from 'mongodb';
import {
  userCollection,
  UserDocument,
} from '../../data/collection/userCollection';
import {assertNotNull} from '../../shared/assert';
import {databaseTest} from '../../test/databaseTest';
import {SubscribeToNewJobNotification} from './subscribeToNewJobNotification';

const {mongoClient: client} = databaseTest();

describe(`saveNewJobNotificationConfig`, () => {
  afterAll(async () => {
    await client.close();
  });
  test(`Valid job filter can be saved`, async () => {
    const userId = new ObjectId();
    await userCollection.insertOne({_id: userId} as UserDocument);

    const subscribeToNewJobNotification = new SubscribeToNewJobNotification({
      authorizer: {
        subscribeToNewJobNotification: () => true,
      },
    });

    const result = await subscribeToNewJobNotification.execute({
      userId: userId.toString(),
      filter: {
        fulltext: 'fulltext',
        durationType: ['Dlouhodobá'],
        employmentType: ['Plný úvazek'],
        legalType: ['Dohoda o provedení práce'],
        place: ['Celá Česká republika'],
        homeoffice: true,
      },
    });

    const user = await userCollection.findOne({
      _id: userId,
    });

    assertNotNull(user);

    expect(user.newJobNotificationSubscription).toEqual(
      expect.objectContaining({
        filter: {
          fulltext: 'fulltext',
          durationType: ['Dlouhodobá'],
          employmentType: ['Plný úvazek'],
          legalType: ['Dohoda o provedení práce'],
          place: ['Celá Česká republika'],
          homeoffice: true,
        },
      })
    );
  });
});
