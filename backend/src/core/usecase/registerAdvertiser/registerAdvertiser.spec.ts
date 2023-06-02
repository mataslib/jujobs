/* eslint-disable @typescript-eslint/ban-ts-comment */
import {advertiserRegistrationCollection} from '../../data/collection/advertiserRegistrationCollection';
import {IMailSender} from '../../service/mailSender';
import {databaseTest} from '../../test/databaseTest';
import {RegisterAdvertiser} from './registerAdvertiser';

const {mongoClient: client} = databaseTest();

jest.setTimeout(15000);

describe(`registerAdvertiser`, () => {
  afterAll(async () => {
    await client.close();
  });

  // beforeAll(async () => {
  //   const jobs = await jobCollection(client);

  //   await jobs.deleteMany({});
  //   await jobs.insertOne(jobDocument);
  //   // atlas search fulltext index is not synchronized immediately
  //   // we have to wait for sync
  //   await new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve(null);
  //     }, 5000);
  //   });
  // });

  test(`AdvertiserRegistration document is persisted, send verification email is triggered`, async () => {
    const mockMailSender: IMailSender = {
      sendMail: jest.fn(() => Promise.resolve({messageId: ''})),
    };

    const registerAdvertiser = new RegisterAdvertiser({
      mailSender: mockMailSender,
    });

    const result = await registerAdvertiser.execute({
      name: `New advertiser company`,
      email: 'newadvertiser@advertiser.com',
      password: 'password',
      verifyUrl: 'https://verify.me',
    });

    const createdAdvertiserRegistration =
      await advertiserRegistrationCollection.findOne({
        email: 'newadvertiser@advertiser.com',
      });
    expect(createdAdvertiserRegistration).not.toBeNull();
    expect(mockMailSender.sendMail).toHaveBeenCalledTimes(1);
  });
});
