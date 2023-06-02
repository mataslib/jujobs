import {generateKeyPair} from 'crypto';
import {writeFile} from 'fs';

(async () => {
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
      writeFile('scripts/public.pem', publicKey, () => {
        console.log('writed key into file.');
      });
      writeFile('scripts/private.pem', privateKey, () => {
        console.log('writed key into file.');
      });

      console.log(publicKey, privateKey);
    }
  );
})();
