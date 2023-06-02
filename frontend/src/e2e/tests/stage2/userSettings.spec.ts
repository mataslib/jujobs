import { test } from "../../myTest";

test.describe.configure({ mode: "parallel" });

test(`User should be able to change email`, async ({ myPage }) => {
  await myPage.asAdvertiser();
  const userSettingsPage = await myPage.gotoUserSettings();
  await userSettingsPage.activateChangeEmailForm();
  await userSettingsPage.fillChangeEmailForm([
    {
      label: "Email",
      type: "fill",
      value: "jujobstest@gmail.com",
    },
  ]);
  await userSettingsPage.submitChangeEmailForm();
  await userSettingsPage.expectSuccessfulChangeEmailFormSubmit();
});

test(`Submit change email > Should dipslay network and api error gracefully`, async ({
  myPage,
}) => {
  await myPage.asAdvertiser();
  const userSettingsPage = await myPage.gotoUserSettings();
  await userSettingsPage.activateChangeEmailForm();
  await userSettingsPage.fillChangeEmailForm([
    {
      label: "Email",
      type: "fill",
      value: "jujobstest@gmail.com",
    },
  ]);
  await myPage.simulateNetworkError(`**/requestEmailChange`);
  await userSettingsPage.submitChangeEmailForm();
  await myPage.expectNetworkErrorGracefulMessage();

  await myPage.simulateApiError(`**/requestEmailChange`);
  await userSettingsPage.submitChangeEmailForm();
  await myPage.expectApiErrorGracefulMessage();
});

test(`User should be able to change password`, async ({ myPage }) => {
  await myPage.asAdvertiser();
  const userSettingsPage = await myPage.gotoUserSettings();
  await userSettingsPage.activateChangePasswordForm();
  await userSettingsPage.fillChangePasswordForm([
    {
      label: `"Heslo"`,
      type: "fill",
      value: "testtest",
    },
    {
      label: `"Heslo znovu"`,
      type: "fill",
      value: "testtest",
    },
  ]);
  await userSettingsPage.submitChangePasswordForm();
  await userSettingsPage.expectSuccessfulChangePasswordFormSubmit();
});
test(`Submit password change > Should display network and api error gracefully`, async ({
  myPage,
}) => {
  await myPage.asAdvertiser();
  const userSettingsPage = await myPage.gotoUserSettings();
  await userSettingsPage.activateChangePasswordForm();
  await userSettingsPage.fillChangePasswordForm([
    {
      label: `"Heslo"`,
      type: "fill",
      value: "testtest",
    },
    {
      label: `"Heslo znovu"`,
      type: "fill",
      value: "testtest",
    },
  ]);
  await myPage.simulateNetworkError(`**/updateUser`);
  await userSettingsPage.submitChangePasswordForm();
  await myPage.expectNetworkErrorGracefulMessage();

  await myPage.simulateApiError("**/updateUser");
  await userSettingsPage.submitChangePasswordForm();
  await myPage.expectApiErrorGracefulMessage();
});
