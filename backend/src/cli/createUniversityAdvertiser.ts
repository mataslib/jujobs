import {program} from 'commander';
import {mongoClient} from '../core/service/mongoClient';
import {CreateUniversityAdvertiser} from '../core/usecase/createUniversityAdvertiser/createUniversityAdvertiser';

program.parse();
const options = program.opts();

const client = mongoClient;
const createUniversityAdvertiser = new CreateUniversityAdvertiser();

(async () => {
  await createUniversityAdvertiser
    .execute()
    .then(console.log)
    .catch(console.log);

  client.close();
})();
