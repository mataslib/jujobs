import {ObjectId} from 'mongodb';
import {
  studentCollection,
  StudentDocument,
} from '../../data/collection/studentCollection';
import {databaseTest} from '../../test/databaseTest';
import {GetStudent} from './getStudent';

const {mongoClient: client} = databaseTest();

describe(`getStudent`, () => {
  afterAll(async () => {
    await client.close();
  });
  test(`I can get stduent view by id`, async () => {
    const studentId = new ObjectId();
    await studentCollection.insertOne({
      _id: studentId,
    } as StudentDocument);

    const getStudent = new GetStudent({
      authorizer: {
        getStudent: () => true,
      },
    });

    const result = await getStudent.execute({
      studentId: studentId.toString(),
    });
  });
});
