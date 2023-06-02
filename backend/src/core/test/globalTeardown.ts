import {MongoClientFactory} from './databaseTest';
import {setupDatabase} from './setupDatabase';
import {teardownDatabase} from './teardownDatabase';

export default async function () {
  // const client = new MongoClientFactory().createConnectedClient();
  // await teardownDatabase(client);
  // setTimeout(() => setupDatabase(client), 20000);
  // prepare db in advance
  // - had to do this since it takes time to create search indexes
  // - I have to wait 20 000 ms, since it takes time until search index is destroyed on database drop
}
