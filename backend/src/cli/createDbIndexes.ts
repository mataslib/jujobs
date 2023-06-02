import {program} from 'commander';
import {createDbIndexes} from '../core/scripts/createDbIndexes';

program.parse();

const options = program.opts();

(async () => {
  await createDbIndexes();
})();
