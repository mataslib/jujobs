import {addMonths} from 'date-fns';
import {ObjectId} from 'mongodb';
import {
  advertiserCollection,
  AdvertiserDocument,
} from '../../data/collection/advertiserCollection';
import {jobCollection, JobDocument} from '../../data/collection/jobCollection';
import {TokenUser} from '../../domain/tokenUser/tokenUser';
import {assertNotNull} from '../../shared/assert';
import {databaseTest} from '../../test/databaseTest';
import {UpdateJob} from './updateJob';

const {mongoClient: client} = databaseTest();

const userId = new ObjectId();
const advertiserId = new ObjectId();
const advertiserDocument: AdvertiserDocument = {
  _id: advertiserId,
  name: 'advertiser name',
  web: 'https://example.com',
  logo: 'https://example.com/logo.png',
  about: 'about advertiser',
};

const jobId = new ObjectId();
const jobDocument: JobDocument = {
  _id: jobId,
  advertiser: {
    _id: advertiserId,
  },
} as JobDocument;

describe(`updateJob`, () => {
  afterAll(async () => {
    await client.close();
  });

  beforeAll(async () => {
    await advertiserCollection.insertOne(advertiserDocument);
    await jobCollection.insertOne(jobDocument);
  });

  test(`Job can be updated`, async () => {
    const updateJob = new UpdateJob({
      // currentUser: currentUser,
      currentUser: TokenUser.unsafeConstruct({
        _id: userId,
        roles: ['advertiser', 'admin'],
        advertiserId: advertiserId.toString(),
      }),
      authorizer: {
        updateJob: () => true,
      },
    });

    const result = await updateJob.execute({
      title: 'Uklízečka',
      scope: 'půl roku',
      text: 'hledáme šikovnou uklízečku seniorku budov kampusu',
      requirements: 'měla byste umět uklízet',
      benefits: 'dostanete cestovní koště',
      salary: '100 Kč / hod',
      place: 'Celá Česká republika',
      specificPlace: 'kdekoli',
      startDate: 'co nejdříve',
      deadlineAt: addMonths(new Date(), 1),
      other: 'jíné',
      fieldTypes: ['Administrativa'],
      legalType: ['Dohoda o provedení práce'],
      durationType: ['Krátkodobá'],
      employmentType: ['Plný úvazek'],
      homeoffice: true,
      jobId: jobId.toString(),
      replyToEmail: 'replyToEmail@example.com',
    });

    const updatedJobDocument = await jobCollection.findOne({
      _id: jobId,
    });
    assertNotNull(updatedJobDocument);
    // Expect advertiser is denormalized into job
    expect(updatedJobDocument.advertiser).toEqual(
      expect.objectContaining({
        name: 'advertiser name',
        web: 'https://example.com',
        logo: 'https://example.com/logo.png',
      })
    );
  });
});
