/* eslint-disable @typescript-eslint/ban-ts-comment */
import {userCollection} from '../../data/collection/userCollection';
import {hashPassword} from '../../service/password';
import {assertErrorDto, assertResultDto} from '../../shared/dto';
import {databaseTest} from '../../test/databaseTest';
import {Authenticate} from './authenticate';

const {mongoClient: client} = databaseTest();

let authenticate: Authenticate;
// let userColl: UnPromisify<ReturnType<typeof userCollection>>;

describe(`authenticate`, () => {
  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    authenticate = new Authenticate();
  });

  test.each([
    [{}],
    [
      {
        email: 'onlyemail@email.cz',
      },
    ],
    [
      {
        password: 'onlypassword',
      },
    ],
  ])(`I should get error on invalid request`, async request => {
    const response = await authenticate.execute(request as any);

    assertErrorDto(response);
  });

  test(`I should be able to authenticate as valid user`, async () => {
    const {hashedPassword, salt} = await hashPassword('test');
    // @ts-ignore
    userCollection.insertOne({
      email: 'mytest@test.cz',
      password: hashedPassword,
      passwordSalt: salt,
    });

    const response = await authenticate.execute({
      email: `mytest@test.cz`,
      password: `test`,
    });

    assertResultDto(response);
  });

  test(`I should not be able to authenticate with non-existing email`, async () => {
    const response = await authenticate.execute({
      email: `nonexistingemail@test.cz`,
      password: `nonexisting`,
    });

    assertErrorDto(response);
  });

  test(`I should not be able to authenticate with wrong password`, async () => {
    const {hashedPassword, salt} = await hashPassword('somepassword');
    // @ts-ignore
    await userCollection.insertOne({
      email: 'wrongpassword@test.cz',
      password: hashedPassword,
      passwordSalt: salt,
    });

    const response = await authenticate.execute({
      email: `wrongpassword@test.cz`,
      password: `wrongpassword`,
    });

    assertErrorDto(response);
  });
});
