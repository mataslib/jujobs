import {ObjectId} from 'mongodb';
import {jobCollection, JobDocument} from '../../data/collection/jobCollection';
import {assertNotNull} from '../../shared/assert';
import {databaseTest} from '../../test/databaseTest';
import {ArchiveJob} from './archiveJob';

const {mongoClient: client} = databaseTest();

const advertiserId = new ObjectId();
const jobId = new ObjectId();
const jobDocument: JobDocument = {
  _id: jobId,
  archived: false,
  advertiser: {
    _id: advertiserId,
  },
} as JobDocument;

describe(`archiveJob`, () => {
  afterAll(async () => {
    await client.close();
  });

  beforeAll(async () => {
    await jobCollection.insertOne(jobDocument);
  });

  test(`Job can be archived`, async () => {
    const archiveJob = new ArchiveJob({
      // currentUser: currentUser,
      authorizer: {
        archiveJob: () => true,
      },
    });

    const result = await archiveJob.execute({
      jobId: jobId.toString(),
    });

    const archivedJobDocument = await jobCollection.findOne({
      _id: jobId,
    });
    assertNotNull(archivedJobDocument);
    expect(archivedJobDocument.archived).toBeTruthy();
  });
});
