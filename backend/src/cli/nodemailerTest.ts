import {Option, program} from 'commander';
import {createTransport} from 'nodemailer';

// program.addOption(
//   new Option(
//     '-p, --password <foopassword>',
//     'Password to be hashed'
//   ).makeOptionMandatory()
// );
program.parse();
const options = program.opts();

(async () => {
  const smtpTransport = createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '5a11e505382091',
      pass: '0804afbce02c07',
    },
  });

  const info = await smtpTransport.sendMail({
    from: 'from@example.com',
    subject: 'Test ahoj',
    text: 'Ahoj!',
    to: 'matas.lib@gmail.com',
  });

  // dostal jsem reponse 250 2.0.0 Ok: queued - to znamena ze je to response meho smtp ze ktereho odesilam,
  // nikoli prijimaciho, to je ta horsi moznost.

  // info = ('{"accepted":["matas.lib@gmail.com"],"rejected":[],"envelopeTime":313,"messageTime":246,"messageSize":277,"response":"250 2.0.0 Ok: queued","envelope":{"from":"from@example.com","to":["matas.lib@gmail.com"]},"messageId":"<32a6d772-f9ff-5ed0-c871-09f8f58531d7@example.com>"}');

  console.log(info);
})();
