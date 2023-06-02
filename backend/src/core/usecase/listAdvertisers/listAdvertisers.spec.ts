import {ObjectId} from 'mongodb';
import {
  advertiserCollection,
  AdvertiserDocument,
} from '../../data/collection/advertiserCollection';
import {databaseTest} from '../../test/databaseTest';
import {ListAdvertisers} from './listAdvertisers';

const {mongoClient: client} = databaseTest();

const advertiserId = new ObjectId();
const advertiserDocument: AdvertiserDocument = {
  _id: advertiserId,
  name: 'acme company',
  logo: 'https://example.com/logo.png',
  web: 'https://example.com',
  about: 'about',
};

describe(`ListAdvertisers @prodOnly`, () => {
  afterAll(async () => {
    await advertiserCollection.deleteOne({_id: advertiserId});
    await client.close();
  });

  beforeAll(async () => {
    await advertiserCollection.insertOne(advertiserDocument);
    // atlas search fulltext index is not synchronized immediately
    // we have to wait for sync
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(null);
      }, 20000);
    });
  });

  const listAdvertisers = new ListAdvertisers();

  describe(`Search by empty criteria`, () => {
    test(`Should be found`, async () => {
      const result = await listAdvertisers.execute({});

      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });
  });

  describe(`Search by fulltext (name, about)`, () => {
    test(`Should be found in name`, async () => {
      const result = await listAdvertisers.execute({
        fulltext: 'acme',
      });

      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });

    test(`Should be found in about`, async () => {
      const result = await listAdvertisers.execute({
        fulltext: 'about',
      });

      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });
  });
});
