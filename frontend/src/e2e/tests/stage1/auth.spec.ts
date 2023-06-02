import { test, expect } from "../../myTest";
import Imap from "imap";
import { MailParser } from "mailparser";

test(`Auth process`, async ({ myPage, page }) => {
  let confirmUrl: string;

  await test.step(`I should be able to register and capture verify email`, async () => {
    const connectedInbox = clearAndConnectInbox();
    const nextMessage = listenForNextMessage(connectedInbox);

    await page.goto("/registrace");
    await page.fill(`"Název"`, "Jujobs");
    await page.fill(`"Email"`, "jujobstest@gmail.com");
    await page.fill(`"Heslo"`, "testtest");
    await page.fill(`"Heslo znovu"`, "testtest");
    await connectedInbox;
    await page.click(`"Registrovat"`);
    await page.waitForURL("/registrace/uspech");

    const confirmEmailMessage = await nextMessage;
    // @ts-ignore .text existuje
    confirmUrl = confirmEmailMessage.text.match(/https?:\/\/[^ ]+/)?.[0];
    await expect(confirmUrl).not.toBeUndefined();
  });

  // Zatim nemam pripraveny alert pro spatne credentials a pro chybu.
  // await test.step(`I should not be able to login until verified`, async () => {
  //   await page.goto("/prihlaseni");
  // await page.fill(`"Název"`, "Jujobs");
  //   await page.fill(`"Email"`, "jujobstest@gmail.com");
  //   await page.fill(`"Heslo"`, "testtest");
  //   await page.click(`form button:has-text("Přihlásit")`);
  //   await page.waitForSelector(`"Špatné přihlašovací údaje."`);
  //   await expect(page).toHaveURL("/prihlaseni");
  // });

  await test.step(`I should be able to verify email`, async () => {
    await page.goto(confirmUrl as string);
    await page.waitForSelector(`"Úspěšně ověřeno!"`);
  });

  await test.step(`I should be able to log in as verified advertiser`, async () => {
    await page.goto("/prihlaseni");
    await page.fill(`"Email"`, "jujobstest@gmail.com");
    await page.fill(`"Heslo"`, "testtest");
    await page.click(`form button:has-text("Přihlásit")`);
    await page.waitForSelector(`"Jste přihlášeni"`);
  });

  await test.step(`I should see "already logged in" on revisiting login page as logged in user`, async () => {
    await page.goto("/prihlaseni");
    await page.waitForSelector(`"Jste přihlášeni"`);
  });

  await test.step(`I should be able to log out via user dropdown, then see login form again`, async () => {
    await page.goto("/prihlaseni");
    await myPage.openUserDropdown();
    await page.click(`"Odhlásit"`);
    // login form should be visible again
    // await myPage.;
    // await expect(page.locator(`[data-user-dropdown]`)).not.toBeVisible();
    await page.waitForSelector(`form button:has-text("Přihlásit")`);
  });

  await test.step(`I should be able to recover forgotten password`, async () => {
    const loginPage = await myPage.gotoLogin();
    const forgottenPasswordPage = await loginPage.gotoForgottenPassword();
    await forgottenPasswordPage.fillForm([
      {
        type: "fill",
        label: "Email",
        value: "jujobstest@gmail.com",
      },
    ]);
    await forgottenPasswordPage.submitForm();
    await forgottenPasswordPage.expectSuccessfulSubmit();
  });
});

test(`Register network error should be displayed gracefully`, async ({
  myPage,
}) => {
  await myPage.page.goto("/registrace");
  await myPage.page.fill(`"Název"`, "Jujobs");
  await myPage.page.fill(`"Email"`, "destinedtofail@gmail.com");
  await myPage.page.fill(`"Heslo"`, "destinedtofail");
  await myPage.page.fill(`"Heslo znovu"`, "destinedtofail");
  await myPage.simulateNetworkError(`**/registerAdvertiser`);
  await myPage.page.click(`"Registrovat"`);
  await myPage.expectNetworkErrorGracefulMessage();
});

test(`Register server errors should be displayed gracefully`, async ({
  myPage,
}) => {
  await myPage.page.goto("/registrace");
  await myPage.page.fill(`"Název"`, "Jujobs");
  await myPage.page.fill(`"Email"`, "destinedtofail@gmail.com");
  await myPage.page.fill(`"Heslo"`, "destinedtofail");
  await myPage.page.fill(`"Heslo znovu"`, "destinedtofail");
  await myPage.simulateApiError(`**/registerAdvertiser`);
  await myPage.page.click(`"Registrovat"`);
  await myPage.expectApiErrorGracefulMessage();
});

test(`Login server error should be displayed gracefully`, async ({
  myPage,
}) => {
  await myPage.gotoHomepage();
  const loginPage = await myPage.gotoLogin();
  await myPage.page.fill(`"Email"`, "destinedtofail@gmail.com");
  await myPage.page.fill(`"Heslo"`, "destinedtofail");
  await myPage.simulateNetworkError(`**/authenticate`);
  await loginPage.submitForm();
  await myPage.expectNetworkErrorGracefulMessage();
});

test(`Login api error should be displayed gracefully`, async ({ myPage }) => {
  await myPage.gotoHomepage();
  const loginPage = await myPage.gotoLogin();
  await myPage.page.fill(`"Email"`, "destinedtofail@gmail.com");
  await myPage.page.fill(`"Heslo"`, "destinedtofail");
  await myPage.simulateApiError(`**/authenticate`);
  await loginPage.submitForm();
  await myPage.expectApiErrorGracefulMessage();
});

function clearAndConnectInbox() {
  return new Promise<OpenedMailbox>((resolve, reject) => {
    var imap = new Imap({
      user: "jujobstest",
      password: "qhvrppwamlxltbqu",
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
      authTimeout: 15000,
      connTimeout: 15000,
    });

    imap.once("ready", async () => {
      console.log("imap ready");

      // imap.seq.fetch("1:", {});
      const clearInbox = new Promise<void>((resolve, reject) => {
        imap.openBox("INBOX", false, (err, box) => {
          if (err) {
            throw err;
          }
          const fetch = imap.seq.fetch("1:*", {});
          fetch.on("message", (msg, seqno) => {
            imap.seq.addFlags(seqno, "\\Deleted", (err) => {
              if (err) {
                throw err;
              }
            });
          });
          fetch.on("end", () => {
            imap.expunge((err) => {
              if (err) {
                throw err;
              }
            });
            resolve();
          });
        });
      });

      await clearInbox;
      console.log("INBOX cleared");

      imap.openBox("INBOX", false, (err, box) => {
        console.log("inbox opened");
        if (err) {
          throw err;
        }
        resolve({
          box,
          imap,
        });
      });
    });
    imap.connect();
  });
}

function connectSentbox() {
  return new Promise<OpenedMailbox>((resolve, reject) => {
    var imap = new Imap({
      user: "jujobstest",
      password: "qhvrppwamlxltbqu",
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      authTimeout: 15000,
      connTimeout: 15000,
    });

    imap.once("ready", async () => {
      console.log("imap ready");

      imap.openBox("INBOX.Sent", false, (err, box) => {
        console.log("inbox opened");
        if (err) {
          throw err;
        }
        resolve({
          box,
          imap,
        });
      });
    });
    imap.connect();
  });
}

type OpenedMailbox = {
  box: Imap.Box;
  imap: Imap;
};

function listenForNextMessage(OpenedMailbox: Promise<OpenedMailbox>) {
  return new Promise<MailParser>((resolve, reject) => {
    OpenedMailbox.then(({ box, imap }) => {
      imap.on("mail", (num) => {
        let fetch = imap.seq.fetch("1:", {
          // bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
          bodies: [""],
          struct: true,
        });
        fetch.on("message", (msg, seqno) => {
          let mailParser = new MailParser();
          msg.on("body", (stream, info) => {
            stream.pipe(mailParser);
            mailParser.on("data", function (obj) {});

            mailParser.on("end", function () {
              // console.log("Message fully parsed!");
              // console.log("Subject:", obj.subject);
              resolve(mailParser);
            });
          });
        });
      });
    });
  });
}
