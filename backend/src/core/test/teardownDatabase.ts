import {MongoClient} from 'mongodb';
import getClient from 'mongodb-atlas-api-client';
export async function teardownDatabase(client: MongoClient) {
  await client.db().dropDatabase();
  // index is not dropped immediately after drop database but nor this way
  // const searchIndexes = await atlasSearch.getAll(
  //   clusterName,
  //   testsDatabaseName,
  //   'job'
  // );
  // searchIndexes.forEach(async index => {
  //   await atlasSearch.delete(clusterName, index.indexID);
  // });
  // await client.db().dropDatabase();
  // // need wait for index to be dropped
  // await new Promise(resolve => setTimeout(resolve, 5000));

  // const collections = await client.db().collections();
  // when not dropping database before tests
  // const jobCollection = collections.find(
  //   collection => collection.collectionName === 'job'
  // );
  // if (!jobCollection) {
  // await client.db().createCollection(`job`);
  // }
}
