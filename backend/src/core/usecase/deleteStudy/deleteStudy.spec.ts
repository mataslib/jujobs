import {ObjectId} from 'mongodb';
import {
  studentCollection,
  StudentDocument,
} from '../../data/collection/studentCollection';
import {databaseTest} from '../../test/databaseTest';
import {DeleteStudy} from './deleteStudy';

const {mongoClient: client} = databaseTest();

describe(`createStudy`, () => {
  afterAll(async () => {
    await client.close();
  });

  test(`I can delete study`, async () => {
    const studentId = new ObjectId();
    const studyId = new ObjectId();
    await studentCollection.insertOne({
      _id: studentId,
      studies: [
        {
          _id: studyId,
        },
      ],
    } as StudentDocument);
    const deleteStudy = new DeleteStudy({
      authorizer: {
        deleteStudy: () => true,
      },
    });

    const result = await deleteStudy.execute({
      studyId: studyId.toString(),
    });

    const updatedStudent = await studentCollection.findOne({
      _id: studentId,
    });
    expect(updatedStudent?.studies?.length).toBeFalsy();
  });
});
