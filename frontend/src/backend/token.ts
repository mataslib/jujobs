import { importSPKI, jwtVerify } from "jose";

const _verifySignedToken = async (publicKeyString: string, token: string) => {
  const publicKey = await importSPKI(publicKeyString, "RS256");
  // possible errors: https://github.com/panva/jose/blob/main/docs/modules/util_errors.md#readme
  return jwtVerify(token, publicKey);
};

export const verifySignedToken = async (token: string) => {
  const publicKey = `-----BEGIN PUBLIC KEY-----
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

  const verified = _verifySignedToken(publicKey, token);
  return verified;
};
