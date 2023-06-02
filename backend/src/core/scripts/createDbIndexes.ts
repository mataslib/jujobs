import {advertiserCollection} from '../data/collection/advertiserCollection';
import {jobCollection} from '../data/collection/jobCollection';
import {userCollection} from '../data/collection/userCollection';
import {mongoClient} from '../service/mongoClient';

export async function createDbIndexes() {
  await jobCollection
    .createIndexes([
      {
        name: 'fulltext',
        key: {
          title: 'text',
          benefits: 'text',
          text: 'text',
          other: 'text',
          requirements: 'text',
          'advertiser.name': 'text',
        },
        default_language: 'none',
      },
      {
        name: 'advertiserId',
        key: {'advertise._id': 1},
      },
      {
        name: 'place',
        key: {place: 1},
      },
      {
        name: 'homeoffice',
        key: {homeoffice: 1},
      },
      {
        name: 'employmentType',
        key: {employmentType: 1},
      },
      {
        name: 'legalType',
        key: {legalType: 1},
      },
      {
        name: 'durationType',
        key: {durationType: 1},
      },
      {
        name: 'approved',
        key: {approved: 1},
      },
      {
        name: 'archived',
        key: {archived: 1},
      },
    ])
    .then(res => {
      console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
    .finally(() => {
      mongoClient.close();
    });

  await advertiserCollection
    .createIndexes([
      {
        name: 'fulltext',
        key: {
          name: 'text',
          about: 'text',
        },
        default_language: 'none',
      },
    ])
    .then(res => {
      console.log(res);
      return res;
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
    .finally(() => {
      mongoClient.close();
    });

  await userCollection.createIndexes([
    {
      name: 'email',
      key: {
        email: 1,
      },
    },
  ]);
}
