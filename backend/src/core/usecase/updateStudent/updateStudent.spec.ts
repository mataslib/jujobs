import {ObjectId} from 'mongodb';
import {
  studentCollection,
  StudentDocument,
} from '../../data/collection/studentCollection';
import {databaseTest} from '../../test/databaseTest';
import {UpdateStudent} from './updateStudent';

const {mongoClient: client} = databaseTest();

describe(`updateStudent`, () => {
  afterAll(async () => {
    await client.close();
  });
  test(`Expect success on valid scenario`, async () => {
    const {updateStudent} = await testSetup();
    const studentId = await givenStudentExists();

    const result = await updateStudent.execute({
      studentId: studentId.toString(),
      cv: 'https://www.mycv.com/',
      linkedin: 'https://www.linkedin.com/',
    });

    const updatedStudent = await studentCollection.findOne({_id: studentId});
    // assert updatedAdvertiser contain object with updated fields
    expect(updatedStudent).toEqual(
      expect.objectContaining({
        cv: 'https://www.mycv.com/',
        linkedin: 'https://www.linkedin.com/',
      })
    );
  });
});

const testSetup = async () => {
  const updateStudent = new UpdateStudent({
    authorizer: {
      updateStudent: () => true,
    },
  });

  return {
    updateStudent,
  };
};

async function givenStudentExists() {
  const studentId = new ObjectId();
  await studentCollection.insertOne({
    _id: studentId,
  } as StudentDocument);
  return studentId;
}
