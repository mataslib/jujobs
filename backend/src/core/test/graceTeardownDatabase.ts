import {MongoClient} from 'mongodb';
export async function graceTeardownDatabase(client: MongoClient) {
  console.log(`executing: grace database teardown`);
  const collections = await client.db().collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }

  console.log('end');
}
