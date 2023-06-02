import {ObjectId} from 'mongodb';
import {
  studentCollection,
  StudentDocument,
} from '../../data/collection/studentCollection';
import {databaseTest} from '../../test/databaseTest';
import {CreateStudy} from './createStudy';

const {mongoClient: client} = databaseTest();

describe(`createStudy`, () => {
  afterAll(async () => {
    await client.close();
  });

  test(`I can create study`, async () => {
    const studentId = new ObjectId();
    await studentCollection.insertOne({
      _id: studentId,
    } as StudentDocument);

    const createStudy = new CreateStudy({
      authorizer: {
        createStudy: () => true,
      },
    });

    const result = await createStudy.execute({
      fakultaSp: 'FPR',
      nazevSp: 'Aplikovaná informatika',
      predmetAbsolvoval: [
        {
          nazevPredmetu: 'Databáze 1',
          znamka: '2',
        },
      ],
      studentId: studentId.toString(),
      typSpKey: '7',
    });

    const updatedStudent = await studentCollection.findOne({
      _id: studentId,
    });
    expect(updatedStudent?.studies).toBeTruthy();
  });
});
