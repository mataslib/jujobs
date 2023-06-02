import {program} from 'commander';
import {mongoClient} from '../core/service/mongoClient';
import {CreateFixtures} from '../core/usecase/createFixtures/createFixtures';

program.parse();
const options = program.opts();

const client = mongoClient;

const createFixtures = new CreateFixtures({
  client: client,
});

(async () => {
  await createFixtures.execute().then(console.log).catch(console.log);

  client.close();
})();
