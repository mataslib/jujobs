import {ObjectId} from 'mongodb';
import {emailChangeRequestCollection} from '../../data/collection/emailChangeRequestCollection';
import {IMailSender} from '../../service/mailSender';
import {assertNotNull, assertNotUndefined} from '../../shared/assert';
import {assertResultDto} from '../../shared/dto';
import {databaseTest} from '../../test/databaseTest';
import {RequestEmailChange} from './requestEmailChange';

const {mongoClient: client} = databaseTest();

const setupTest = () => {
  const mockMailSender: IMailSender = {
    sendMail: jest.fn(() => Promise.resolve({messageId: ''})),
  };

  const userId = new ObjectId();

  const requestEmailChange = new RequestEmailChange({
    mailsender: mockMailSender,
    authorizer: {
      requestEmailChange: () => true,
    },
  });

  return {
    mockMailSender,
    requestEmailChange,
    userId,
  };
};

describe(`requestEmailChange`, () => {
  afterAll(async () => {
    await client.close();
  });

  test(`Existing user should be sent email with verify email instructions`, async () => {
    const {requestEmailChange, mockMailSender, userId} = setupTest();

    const resultDto = await requestEmailChange.execute({
      newEmail: 'newEmail@gmail.com',
      verifyEmailUrl: 'https://example.com/request-change-email',
      userId: userId.toString(),
    });

    assertResultDto(resultDto);
    assertNotUndefined(resultDto);
    expect(mockMailSender.sendMail).toHaveBeenCalledTimes(1);
    const dbRequest = await emailChangeRequestCollection.findOne({
      _id: new ObjectId(resultDto.requestId),
    });
    assertNotNull(dbRequest);
    expect(dbRequest.token.length).toBeGreaterThan(1);
    expect(dbRequest.verifyEmailUrl).toBe(
      `https://example.com/request-change-email/${dbRequest.token}`
    );
  });
});
