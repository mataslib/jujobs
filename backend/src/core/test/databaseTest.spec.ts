import {databaseTest} from './databaseTest';

const {mongoClient: client} = databaseTest();

describe(`databaseTest`, () => {
  afterAll(async () => {
    await client.close();
  });
  test(`sometest`, async () => {
    await client.db().collection('mytest').insertOne({
      test: 'test',
    });
  });
});
