import {Option, program} from 'commander';
import {hashPassword} from '../core/service/password';

program.addOption(
  new Option(
    '-p, --password <foopassword>',
    'Password to be hashed'
  ).makeOptionMandatory()
);
program.parse();
const options = program.opts();

(async () => {
  const hashedPassword = await hashPassword(options.password);
  console.log(`pw:${hashedPassword.hashedPassword}`);
  console.log(`salt:${hashedPassword.salt}`);
})();
