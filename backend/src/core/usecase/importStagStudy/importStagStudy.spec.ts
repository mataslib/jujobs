import {ObjectId} from 'mongodb';
import {
  studentCollection,
  StudentDocument,
} from '../../data/collection/studentCollection';
import {databaseTest} from '../../test/databaseTest';
import {ImportStagStudy} from './importStagStudy';

const {mongoClient: client} = databaseTest();

describe.skip(`importStagStudy`, () => {
  afterAll(async () => {
    await client.close();
  });

  test(`I can import student data`, async () => {
    const studentId = new ObjectId();
    await studentCollection.insertOne({
      _id: studentId,
    } as StudentDocument);

    const importStag = new ImportStagStudy({
      authorizer: {
        importStagStudy: () => true,
      },
    });
    const result = await importStag.execute({
      studentId: studentId.toString(),
      stagUserTicket:
        '65af59e1cc36204a8703e5732a54296b1e0f9514c0a7347e59803bbcefdfedd2',
    });

    const updatedStudent = await studentCollection.findOne({
      _id: studentId,
    });
    expect(updatedStudent?.studies).toBeTruthy();
  });
});
