import {ObjectId} from 'mongodb';
import {jobCollection, JobDocument} from '../../data/collection/jobCollection';
import {assertNotNull} from '../../shared/assert';
import {databaseTest} from '../../test/databaseTest';
import {ApproveJob} from './approveJob';

const {mongoClient: client} = databaseTest();

const userId = new ObjectId();

const jobId = new ObjectId();
const jobDocument: JobDocument = {
  _id: jobId,
  approved: false,
} as JobDocument;

describe(`approveJob`, () => {
  afterAll(async () => {
    await client.close();
  });

  beforeAll(async () => {
    await jobCollection.insertOne(jobDocument);
  });

  test(`Job can be approved`, async () => {
    const approveJob = new ApproveJob({
      authorizer: {
        approveJob: () => true,
      },
    });

    const result = await approveJob.execute({
      jobId: jobId.toString(),
    });

    const approvedJobDocument = await jobCollection.findOne({
      _id: jobId,
    });

    assertNotNull(approvedJobDocument);
    expect(approvedJobDocument.approved).toBeTruthy();
  });
});
