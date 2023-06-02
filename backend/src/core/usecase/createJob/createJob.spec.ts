/* eslint-disable @typescript-eslint/ban-ts-comment */
import {addMonths} from 'date-fns';
import {ObjectId} from 'mongodb';
import {
  advertiserCollection,
  AdvertiserDocument,
} from '../../data/collection/advertiserCollection';
import {jobCollection} from '../../data/collection/jobCollection';
import {TokenUser} from '../../domain/tokenUser/tokenUser';
import {assertNotNull} from '../../shared/assert';
import {databaseTest} from '../../test/databaseTest';
import {CreateJob} from './createJob';

const {mongoClient} = databaseTest();

const advertiserId = new ObjectId();

const advertiserDocument: AdvertiserDocument = {
  _id: advertiserId,
  name: 'advertiser name',
  web: 'https://example.com',
  logo: 'https://example.com/logo.png',
  about: 'about advertiser',
};

describe(`createJob`, () => {
  afterAll(async () => {
    await mongoClient.close();
  });

  beforeAll(async () => {
    await advertiserCollection.insertOne(advertiserDocument);
  });

  test(`Valid job can be created`, async () => {
    const createJob = new CreateJob({
      authorizer: {
        createJob: () => true,
      },
      currentUser: TokenUser.unsafeConstruct({
        advertiserId: advertiserId.toString(),
      }),
    });

    const result = await createJob.execute({
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
      advertiserId: advertiserId.toString(),
      replyToEmail: 'replyToEmail@example.com',
    });

    const createdJobDocument = await jobCollection.findOne({
      _id: new ObjectId(result.jobId),
    });
    assertNotNull(createdJobDocument);
    // Expect advertiser is denormalized into job
    expect(createdJobDocument.advertiser).toEqual(
      expect.objectContaining({
        name: 'advertiser name',
        web: 'https://example.com',
        logo: 'https://example.com/logo.png',
      })
    );
  });
});
