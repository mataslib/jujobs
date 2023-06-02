import {ObjectId} from 'mongodb';
import {jobCollection, JobDocument} from '../../data/collection/jobCollection';
import {databaseTest} from '../../test/databaseTest';
import {DeleteJob} from './deleteJob';

const {mongoClient: client} = databaseTest();

const advertiserId = new ObjectId();
const jobId = new ObjectId();
const jobDocument: JobDocument = {
  _id: jobId,
  advertiser: {
    _id: advertiserId,
  },
} as JobDocument;

describe(`deleteJob`, () => {
  afterAll(async () => {
    await client.close();
  });

  test(`Any job can be deleted by admin`, async () => {
    await jobCollection.insertOne(jobDocument);
    const deleteJob = new DeleteJob({
      // currentUser: currentUser,
      authorizer: {
        deleteJob: () => true,
      },
    });

    const result = await deleteJob.execute({
      jobId: jobId.toString(),
    });

    const deletedJobDocument = await jobCollection.findOne({
      _id: jobId,
    });
    expect(deletedJobDocument).toBeNull();
  });

  // todo: new job must be inserted into database
  test(`Job can be deleted by it's advertiser`, async () => {
    await jobCollection.insertOne(jobDocument);
    const deleteJob = new DeleteJob({
      // currentUser: currentUser,
      authorizer: {
        deleteJob: () => true,
      },
    });

    const result = await deleteJob.execute({
      jobId: jobId.toString(),
    });

    const deletedJobDocument = await jobCollection.findOne({
      _id: jobId,
    });
    expect(deletedJobDocument).toBeNull();
  });
});
