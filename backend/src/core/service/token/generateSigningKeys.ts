import {generateKeyPair} from 'crypto';

export const generateSigningKeys = async () => {
  return new Promise<{privateKey: string; publicKey: string}>(
    (resolve, reject) => {
      generateKeyPair(
        'rsa',
        {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
          },
        },
        (err, publicKey, privateKey) => {
          resolve({
            privateKey: privateKey,
            publicKey: publicKey,
          });
        }
      );
    }
  );
};
