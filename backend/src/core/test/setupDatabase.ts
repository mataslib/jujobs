import {MongoClient} from 'mongodb';
// import {createJobSearchIndex} from '../scripts/createJobSearchIndex';
// import {createAdvertiserSearchIndex} from '../scripts/createAdvertiserSearchIndex';
export async function setupDatabase(client: MongoClient) {
  const clusterName = 'Cluster0';
  const databaseName = 'tests';
  const dbs = await client.db().admin().listDatabases();
  if (dbs.databases.filter(el => el.name === databaseName).length > 0) {
    console.log(
      'tests database already exists. Skipping setup. Teardown first.'
    );
    return;
  }

  // await createJobSearchIndex({
  //   clusterName,
  //   databaseName,
  // });

  // await createAdvertiserSearchIndex({
  //   clusterName,
  //   databaseName,
  // });
}
