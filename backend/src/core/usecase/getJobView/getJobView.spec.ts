import {jobCollection} from '../../data/collection/jobCollection';
import {databaseTest} from '../../test/databaseTest';
import {jobDocument} from '../../test/job';
import {GetJobView} from './getJobView';

const {mongoClient: client} = databaseTest();

describe(`getJobView`, () => {
  afterAll(async () => {
    await client.close();
  });
  test(`I can get job view by id`, async () => {
    const jobDoc = jobDocument();
    await jobCollection.insertOne(jobDoc);

    const getJobView = new GetJobView();
    const result = await getJobView.execute({
      jobId: jobDoc._id.toString(),
    });
  });
});
