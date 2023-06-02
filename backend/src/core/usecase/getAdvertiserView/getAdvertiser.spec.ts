import {ObjectId} from 'mongodb';
import {
  advertiserCollection,
  AdvertiserDocument,
} from '../../data/collection/advertiserCollection';
import {databaseTest} from '../../test/databaseTest';
import {GetAdvertiserView} from './getAdvertiserVIew';

const {mongoClient: client} = databaseTest();

describe(`getAdvertiser`, () => {
  afterAll(async () => {
    await client.close();
  });
  test(`I can get advertiser view by id`, async () => {
    const advertiserId = new ObjectId();
    await advertiserCollection.insertOne({
      _id: advertiserId,

      name: 'Advertiser',
    } as AdvertiserDocument);

    const getAdvertiserView = new GetAdvertiserView();

    const result = await getAdvertiserView.execute({
      advertiserId: advertiserId.toString(),
    });
  });
});
