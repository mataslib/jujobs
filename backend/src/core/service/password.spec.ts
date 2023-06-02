import {comparePasswords, hashPassword} from './password';

test(`
hashed password should be different hashed B64 string,
salt should be unique for each hash call,
on compare, it should return true if the password matches,
it should return false if the password does not match,
it should return false if the salt does not match
`, async () => {
  const input = 'password';
  const actual = await hashPassword(input);
  const onceMore = await hashPassword(input);

  expect(typeof actual.hashedPassword).toBe('string');
  expect(actual.hashedPassword).not.toBe('password');
  expect(actual.salt).not.toBe(onceMore.salt);
  expect(actual.hashedPassword).not.toBe(onceMore.hashedPassword);

  expect(
    await comparePasswords(input, actual.hashedPassword, actual.salt)
  ).toBe(true);

  expect(
    await comparePasswords(input, actual.hashedPassword, 'wrong salt')
  ).toBe(false);

  expect(
    await comparePasswords(`${input}_`, actual.hashedPassword, actual.salt)
  ).toBe(false);
});
