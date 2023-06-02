import {databaseTest} from './databaseTest';
import {graceTeardownDatabase} from './graceTeardownDatabase';
import {setupDatabase} from './setupDatabase';
// import {teardownDatabase} from './teardownDatabase';

export default async function () {
  if (process.env.NO_GLOBAL_SETUP) {
    console.log(`skipping globalSetup`);
    return;
  }

  const {mongoClient: client} = databaseTest();

  // if (process.env.DB_COMPLETE_TEARDOWN) {
  //   await teardownDatabase(client);
  //   // wait for index to be deleted
  //   await new Promise(resolve => setTimeout(resolve, 60000));
  // }

  await graceTeardownDatabase(client);
  console.log('setup database');
  await setupDatabase(client);

  // if (process.env.DB_COMPLETE_TEARDOWN) {
  //   // wait for index to be ready
  //   await new Promise(resolve => setTimeout(resolve, 60000));
  // }

  await client.close();
}
