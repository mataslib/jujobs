/* eslint-disable @typescript-eslint/ban-ts-comment */
import {ObjectId} from 'mongodb';
import {jobCollection, JobDocument} from '../../data/collection/jobCollection';
import {databaseTest} from '../../test/databaseTest';
import {jobDocument} from '../../test/job';
import {ListJobs} from './listJobs';

const {mongoClient: client} = databaseTest();

const jobId = new ObjectId();

const advertiserId = new ObjectId();
// todo make specific document for this test without recreating every time
//
const jobDoc: JobDocument = jobDocument({
  _id: jobId,
  title: 'Uklízečka',
  scope: 'půl roku',
  text: 'hledáme šikovnou uklízečku seniorku budov kampusu',
  requirements: 'měla byste umět uklízet',
  benefits: 'dostanete cestovní koště',
  place: 'Celá Česká republika',
  other: 'jíné',
  legalType: ['Dohoda o provedení práce'],
  durationType: ['Krátkodobá'],
  employmentType: ['Plný úvazek'],
  homeoffice: true,
  advertiser: {
    _id: advertiserId,
    name: 'some company',
    logo: 'https://example.com/logo.png',
    web: 'https://example.com',
  },
  archived: false,
  approved: true,
});

describe(`listJobs @prodOnly`, () => {
  afterAll(async () => {
    await jobCollection.deleteOne({_id: jobId});
    await client.close();
  });

  beforeAll(async () => {
    await jobCollection.insertOne(jobDoc);
    // atlas search fulltext index is not synchronized immediately
    // we have to wait for sync
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(null);
      }, 20000);
    });
  });

  const listJobs = new ListJobs();

  describe(`Search by place`, () => {
    test(`Should be found`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        place: ['Celá Česká republika', 'Zahraničí'],
      });

      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });

    test(`Should not be found`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        place: ['Zahraničí'],
      });

      expect(result.meta.total).toBe(0);
    });
  });

  describe(`Search by fulltext (title, text, requirements, benefits, other)`, () => {
    test(`Should be found in title`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        fulltext: 'uklízečka',
      });

      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });

    test(`Should be found in text`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        fulltext: 'senior',
      });

      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });

    test(`Should not be found`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        fulltext: 'dřevorubec',
      });

      expect(result.meta.total).toBe(0);
    });
  });

  describe(`Search by employmentType type`, () => {
    test(`Should be found`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        employmentType: ['Plný úvazek', 'Zkrácený úvazek'],
      });

      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });

    test(`Should not be found`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        employmentType: ['Pracovní doba dle dohody'],
      });

      expect(result.meta.total).toBe(0);
    });
  });

  describe(`Search by legal type`, () => {
    test(`Should be found`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        legalType: ['Dohoda o provedení práce', 'Dohoda o provedení činnosti'],
      });

      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });

    test(`Should not be found`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        legalType: ['Dohoda o provedení činnosti'],
      });

      expect(result.meta.total).toBe(0);
    });
  });

  describe(`Search by duration type`, () => {
    test(`Should be found`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        durationType: [
          'Krátkodobá',
          'Krátkodobá s možností navázaní spolupráce',
        ],
      });

      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });

    test(`Should not be found`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        durationType: ['Dlouhodobá'],
      });

      expect(result.meta.total).toBe(0);
    });
  });

  describe(`Search by advertiser id`, () => {
    test(`Should be found`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        advertiserId: advertiserId.toString(),
      });

      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });

    test(`Should not be found`, async () => {
      const result = await listJobs.execute({
        _id: jobId.toString(),
        advertiserId: new ObjectId().toString(),
      });

      expect(result.meta.total).toBe(0);
    });
  });

  describe.skip(`Archived or unapproved should not be found if not explicitly specified`, () => {});
  describe.skip(`Archived or unapproved should be be found if explicitly specified`, () => {});
});
