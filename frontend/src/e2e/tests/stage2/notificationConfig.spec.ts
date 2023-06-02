import { test } from "../../myTest";
import { NotificationPage } from "../../pageObjectModel/newJobNotificationPage";

test(`View current notification config > Should display network and api error is gracefully`, async ({
  myPage,
}) => {
  await myPage.asStudent();
  const notificationPage = new NotificationPage(myPage);

  await myPage.simulateNetworkError(`**/getNewJobNotificationConfig/*`);
  await notificationPage.goto();
  await myPage.expectNetworkErrorGracefulMessage();

  await myPage.simulateApiError(`**/getNewJobNotificationConfig/*`);
  await notificationPage.goto();
  await myPage.expectApiErrorGracefulMessage();
});

test(`notifications`, async ({ myPage }) => {
  const notificationPage = new NotificationPage(myPage);
  await test.step(`setup clean state`, async () => {
    await myPage.asStudent();

    await notificationPage.goto();

    if (await notificationPage.isNotificationsTurnedOn()) {
      await notificationPage.turnNotificationsOff();
    }
  });

  await test.step(`Turn on notifications > Should display network and api error gracefully`, async () => {
    await notificationPage.goto();
    await myPage.simulateNetworkError(`**/saveNewJobNotificationConfig`);
    await notificationPage.submitFormAndTurnNotificationsOn();
    await myPage.expectNetworkErrorGracefulMessage();

    await myPage.simulateApiError(`**/saveNewJobNotificationConfig`);
    await notificationPage.submitFormAndTurnNotificationsOn();
    await myPage.expectApiErrorGracefulMessage();
  });

  await test.step(`Student should be able to turn on his notification settings`, async () => {
    await notificationPage.goto();
    await notificationPage.fillForm([
      {
        label: "V názvu / textu",
        type: "fill",
        value: "Astronaut",
      },
    ]);
    await notificationPage.submitFormAndTurnNotificationsOn();
    await notificationPage.expectSuccessfulNotificationsTurnedOn();
  });

  await test.step(`Turn off notifications > Should display network and api error is gracefully`, async () => {
    await notificationPage.goto();

    await myPage.simulateNetworkError(`**/deleteNewJobNotificationConfig`);
    await notificationPage.turnNotificationsOff();
    await myPage.expectNetworkErrorGracefulMessage();

    await myPage.simulateApiError(`**/deleteNewJobNotificationConfig`);
    await notificationPage.turnNotificationsOff();
    await myPage.expectApiErrorGracefulMessage();
  });

  await test.step(`Student should be able to turn off his notification settings`, async () => {
    await notificationPage.goto();
    await notificationPage.turnNotificationsOff();
    await notificationPage.expectSuccessfulNotificationsTurnedOff();
  });
});
