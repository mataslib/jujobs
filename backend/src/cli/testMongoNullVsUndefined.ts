import {program} from 'commander';
import {mongoClient} from '../core/service/mongoClient';

program.parse();
const options = program.opts();

const client = mongoClient;
(async () => {
  const result = await client.db().collection('test').insertOne({
    undefined: undefined,
    null: null,
  });
  const insertedDocument = await client.db().collection('test').findOne({
    _id: result.insertedId,
  });

  // vrati se document
  // Mongo prevadi undefined hodnoty na null!
  // {
  //   undefined: null,
  //   null: null,
  // }
})();
