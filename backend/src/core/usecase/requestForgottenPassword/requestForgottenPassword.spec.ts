import {ObjectId} from 'mongodb';
import {forgottenPasswordRequestCollection} from '../../data/collection/forgottenPasswordRequestCollection';
import {userCollection} from '../../data/collection/userCollection';
import {IMailSender} from '../../service/mailSender';
import {assertNotNull, assertNotUndefined} from '../../shared/assert';
import {assertResultDto} from '../../shared/dto';
import {databaseTest} from '../../test/databaseTest';
import {RequestForgottenPassword} from './requestForgottenPassword';

const {mongoClient: client} = databaseTest();

const setupTest = () => {
  const mockMailSender: IMailSender = {
    sendMail: jest.fn(() => Promise.resolve({messageId: ''})),
  };

  const requestForgottenPassword = new RequestForgottenPassword({
    mailsender: mockMailSender,
  });

  return {
    mockMailSender,
    requestForgottenPassword,
  };
};

describe(`requestForgottenPassword`, () => {
  afterAll(async () => {
    await client.close();
  });

  test(`Existing user should be sent email with password reset instructions`, async () => {
    const {requestForgottenPassword, mockMailSender} = setupTest();
    const userId = new ObjectId();
    await userCollection.insertOne({
      _id: userId,
      email: 'requestForgottenPasswordUser@gmail.com',
    });

    const resultDto = await requestForgottenPassword.execute({
      email: 'requestForgottenPasswordUser@gmail.com',
      changePasswordUrl: 'https://example.com/change-password',
    });

    assertResultDto(resultDto);
    assertNotUndefined(resultDto);
    expect(mockMailSender.sendMail).toHaveBeenCalledTimes(1);
    const dbRequest = await forgottenPasswordRequestCollection.findOne({
      _id: new ObjectId(resultDto.requestId),
    });
    assertNotNull(dbRequest);
    expect(dbRequest.token.length).toBeGreaterThan(1);
    expect(dbRequest.changePasswordUrl).toBe(
      `https://example.com/change-password/${dbRequest.token}`
    );
  });

  test(`System should pretend non-existing user to be also successful`, async () => {
    const {requestForgottenPassword, mockMailSender} = setupTest();

    const resultDto = await requestForgottenPassword.execute({
      email: 'requestForgottenPasswordUserNonExisting@gmail.com',
      changePasswordUrl: 'https://example.com/change-password',
    });

    assertResultDto(resultDto);
    expect(mockMailSender.sendMail).not.toBeCalled();
  });
});
