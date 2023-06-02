import {program} from 'commander';
import {mongoClient} from '../core/service/mongoClient';
import {hashPassword} from '../core/service/password';
import {CreateUniversityAdmin} from '../core/usecase/createUniversityAdmin/createUniversityAdmin';

program.parse();
const options = program.opts();

const client = mongoClient;
const createUniversityAdmin = new CreateUniversityAdmin();

(async () => {
  const hashedPassword = await hashPassword('testtest');
  await createUniversityAdmin
    .execute({
      email: 'test@jcu.cz',
      password: hashedPassword.hashedPassword,
      passwordSalt: hashedPassword.salt,
    })
    .then(console.log)
    .catch(console.log);

  client.close();
})();
