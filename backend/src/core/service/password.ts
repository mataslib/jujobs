import {scrypt, randomBytes} from 'crypto';

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  return _hashPassword(password, salt);
}

export async function comparePasswords(
  password: string,
  hashedPasswordB64: string,
  usedSaltB64: string
) {
  const decodedSalt = Buffer.from(usedSaltB64, 'base64');

  return _hashPassword(password, decodedSalt).then(hashResult => {
    return hashResult.hashedPassword === hashedPasswordB64;
  });
}

function _hashPassword(password: string, salt: Buffer) {
  return new Promise<hashSuccess>((resolve, reject) => {
    scrypt(password, salt, 64, (err, hashedPassword) => {
      if (err) {
        return reject(err);
      }
      return resolve({
        salt: salt.toString('base64'),
        hashedPassword: hashedPassword.toString('base64'),
      });
    });
  });
}

type hashSuccess = {
  salt: string;
  hashedPassword: string;
};
