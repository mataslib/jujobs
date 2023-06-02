import {program, Option} from 'commander';
import {chromium} from 'playwright';

program.addOption(
  new Option(
    '-u, --username <matasl02>',
    'Login username'
  ).makeOptionMandatory()
);
program.addOption(
  new Option(
    '-p, --password <foopassword>',
    'Login password'
  ).makeOptionMandatory()
);
program.parse();
const options = program.opts();

(async () => {
  const browser = await chromium.launch({
    // headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(
    'https://wstag.jcu.cz/ws/login?originalURL=http://localhost/catchme'
  );
  await page.fill('#username_jaas', options.username);
  await page.fill('#password_jaas', options.password);

  let resolveStagUserTicketPromise: (value: string) => void;
  const stagUserTicketPromise = new Promise<string>(resolve => {
    resolveStagUserTicketPromise = resolve;
  });

  page.on('requestfailed', request => {
    if (request.url().startsWith('http://localhost/catchme')) {
      const url = new URL(request.url());
      const stagUserTicket = url.searchParams.get('stagUserTicket');
      if (stagUserTicket) {
        resolveStagUserTicketPromise(stagUserTicket);
      }
    }
  });

  await Promise.all([
    page.waitForNavigation(),
    // page.waitForRequest('**/catchme'),
    page.click(`[action="/ws/login/process"] [type="submit"]`),
  ]);

  const stagUserTicket = await stagUserTicketPromise;
  console.log(stagUserTicket);

  await context.close();
  await browser.close();
})();
