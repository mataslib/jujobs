import {ObjectId} from 'mongodb';
import {z} from 'zod';
import {jobCollection} from '../../data/collection/jobCollection';
import {mongoClient} from '../../service/mongoClient';

class TestClass {
  ahoj = 'zavolat';

  get neco() {
    return 'neco';
  }

  zavolat() {
    return 'zavolat';
  }

  fnProp = () => {
    console.log(this.ahoj);
    return 'fnProp';
  };
}

test(`test`, async () => {
  const someId = new ObjectId();
  const schema = z.object({
    test: z
      .string()
      .transform(v => new ObjectId(v))
      .nullish(),
  });

  const objId = new ObjectId().toString();

  await jobCollection.insertOne({_id: '641087e0c4b80abcf6fd269a'});
  const dbJob = await jobCollection.findOne({
    _id: new ObjectId('641087e0c4b80abcf6fd269a'),
  });

  const parsed = schema.parse({test: '640f2e582da1a98984bb9f9c'});
  const parsedUndefined = schema.parse({test: undefined});
  const parsedMissing = schema.parse({});

  const myClass = new TestClass();

  const someObjectId = new ObjectId();
  const objectIdFromObjectId = new ObjectId(someObjectId);

  const literal = {...myClass};
  const test = await mongoClient
    .db()
    .collection('testClass')
    .insertOne(myClass);
});

test.todo(`created job is not archived`);
test.todo(`created job is not approved`);
test.todo(`created job is approved if user is admin`);
test.todo(`created job has createdAt and updatedAt date`);
test.todo(`updated job has updatedAt`);
test.todo(`updated job becomes unapproved`);
test.todo(`updated job not becomes unapproved if user is admin`);
test.todo(`advertiser data is denormalized into job`);
