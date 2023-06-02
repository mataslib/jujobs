import {ObjectId} from 'mongodb';
import {
  studentCollection,
  StudentDocument,
} from '../../data/collection/studentCollection';
import {isSameId} from '../../shared/sameId';
import {databaseTest} from '../../test/databaseTest';
import {UpdateStudy} from './updateStudy';

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

    const updateStudy = new UpdateStudy({
      authorizer: {
        updateStudy: () => true,
      },
    });

    const result = await updateStudy.execute({
      studyId: studyId.toString(),
      nazevSp: 'Updated',
      fakultaSp: 'FPR',
      typSpKey: '7',
      predmetAbsolvoval: [],
    });

    const updatedStudent = await studentCollection.findOne({
      _id: studentId,
    });
    const udpatedStudy = updatedStudent?.studies?.find(study =>
      isSameId(study._id, studyId)
    );
    expect(udpatedStudy).toEqual(
      expect.objectContaining({
        nazevSp: 'Updated',
        fakultaSp: 'FPR',
        typSpKey: '7',
        predmetAbsolvoval: [],
        dataSource: 'user',
      })
    );
  });
});
