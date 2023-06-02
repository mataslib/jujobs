import {createSignedToken, verifySignedToken} from './token';
import {add, sub} from 'date-fns';
import {generateSigningKeys} from './generateSigningKeys';

test(`I can generate signing keys, crypto should be used`, async () => {
  const {publicKey, privateKey} = await generateSigningKeys();

  expect(typeof publicKey).toBe('string');
  expect(typeof privateKey).toBe('string');
});

test(`I can create signed token, signed token is string`, async () => {
  const token = await createSignedToken(
    {hello: 'hello'},
    new Date(),
    new Date()
  );

  expect(typeof token).toBe('string');
});

test(`I can parse and verify valid signed token`, async () => {
  const token = await createSignedToken(
    {hello: 'hello', nested: {hello: 'hello'}},
    new Date(),
    add(new Date(), {days: 1})
  );

  const result = await verifySignedToken(token);
  expect(result.payload).toEqual(
    expect.objectContaining({hello: 'hello', nested: {hello: 'hello'}})
  );
});
test(`Verify expired token throws error`, async () => {
  const token = await createSignedToken(
    {hello: 'hello'},
    sub(new Date(), {days: 1}),
    sub(new Date(), {hours: 1})
  );

  await expect(verifySignedToken(token)).rejects.toThrow();
});

// todo:
// test(`Modified token must throw`, async () => {
//   const {publicKey, privateKey} = await generateSigningKeys();
//   const token = await createSignedToken(
//     privateKey,
//     {hello: 'hello'},
//     sub(new Date(), {days: 1}),
//     new Date()
//   );
//   const modifiedToken = '';
// });
