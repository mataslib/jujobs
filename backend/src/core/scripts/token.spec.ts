import {SignJWT, importPKCS8, importSPKI, jwtVerify} from 'jose';

test('I can sign token and verify', async () => {
  const payload = {hello: 'hello'};
  const createdAt = new Date();
  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + 1);

  const privateKeyString = `-----BEGIN PRIVATE KEY-----
  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
  HM9rBtccbPZSzvSMhZxR9ru7mMyryCY=
  -----END PRIVATE KEY-----`;
  const publicKeyString = `-----BEGIN PUBLIC KEY-----
  MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAu4MiRGUDjKTySZ9d5Crv
  KPSmm6bitpidyTUW39e6I9HDZB58dicf4svp0rPlFW0DAlhCtEXkWUKQlZ7EB+p9
  5FwINCYquvXaX/3004rTyEZ+xJ8TqfDxhXp9PjpKIzbHGMf1Lpg/XRxlT45ahM7D
  MiNEleawz6qCvNBAo/NspCBB+KgNFnTl8Kix8GHOnKpEqqnKimmmkArntVSRkv8w
  Qokk30I5MjV+Eb3GwzA2F+T/ifmMHnmWcvq3ZJUvMWdbdqn9EsstXFxcuOgazvWc
  8m5Ptgl937+h1OW4pIusCSRbhzoM/AGB2PUjPWB7xJKf1qzuNwOSTuP98Zm1kumu
  AEraDZwi3JePPPQ1SEu/RGXfi3X0sSmZGw/4mTrvbSqkIlDDJs1MOIb4SHaXpIZR
  JtFhSDd6r7kOUnSvYPnvBBzU0DteHV22VHqCttbVzxuoc+emq1xN6+ZD04M/zJzc
  XzV9St4DdRAWpFoaXigUaFS8rDpiC7fVTaPRxV1B/Xxd7iouhAO4YwCCdpACRUG+
  9J0SuXSC+o3m4dNEwoqD25ZQz2zXE1Ct8GuRhIXpSZQ5h9aNt51Ek2L2ay0grCqq
  u2MN4+/tpQeOy9Y6r0H7fDzXIqOjWybGmlhpePaXRKRurQkoDUGR51TIcALU13dV
  ZLC+7ZP1isCr/bw3BcS0mmMCAwEAAQ==
  -----END PUBLIC KEY-----`;
  const privateKey = await importPKCS8(privateKeyString, 'RS256');

  const signedToken = await new SignJWT(payload)
    .setProtectedHeader({alg: 'RS256'})
    .setIssuedAt(createdAt.valueOf())
    .setExpirationTime(expiresAt.valueOf())
    .sign(privateKey);

  const publicKey = await importSPKI(publicKeyString, 'RS256');

  let verifiedToken;
  try {
    verifiedToken = await jwtVerify(signedToken, publicKey);
  } catch (err) {
    console.error(err);
  }

  expect(verifiedToken?.payload.hello).toBe('hello');
});
