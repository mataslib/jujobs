import {program} from 'commander';
import {mongoClient} from '../core/service/mongoClient';
import {DeleteFixtures} from '../core/usecase/deleteFixtures/deleteFixtures';

program.parse();
const options = program.opts();

const client = mongoClient;
const deleteFixtures = new DeleteFixtures({
  client: client,
});

(async () => {
  await deleteFixtures.execute().then(console.log).catch(console.log);

  await client.close(true);
  console.log('end');
})();
