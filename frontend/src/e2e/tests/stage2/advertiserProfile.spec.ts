import { FillFormDefinitions } from "../../myPage";
import { test } from "../../myTest";

test(`Advertiser can update it's profile`, async ({ myPage }) => {
  await myPage.asAdvertiser();
  const advertiserProfilePage = await myPage.gotoUpdateAdvertiserProfile();

  await advertiserProfilePage.fillForm(validFormData);
  await advertiserProfilePage.submitForm();
  await advertiserProfilePage.expectSuccessfulSubmit();

  // expect form is prefilled with updated values
  await myPage.page.reload();
  await myPage.page.waitForSelector(`text=${validFormData[0].value}`);
  await myPage.page.waitForSelector(`[value="${validFormData[1].value}"]`);
});

test(`Prefill update advertiser profile form > Should display api and network error is gracefully`, async ({
  myPage,
}) => {
  await myPage.asAdvertiser();

  await myPage.simulateNetworkError(`**/getAdvertiserView/*`);
  await myPage.gotoUpdateAdvertiserProfile();
  await myPage.expectNetworkErrorGracefulMessage();

  await myPage.simulateApiError(`**/getAdvertiserView/*`);
  await myPage.page.reload();
  await myPage.expectApiErrorGracefulMessage();
});

test(`Submit update advertiser profile form > Should display api and network error gracefully`, async ({
  myPage,
}) => {
  await myPage.asAdvertiser();
  const advertiserProfilePage = await myPage.gotoUpdateAdvertiserProfile();
  await advertiserProfilePage.fillForm(validFormData);
  await myPage.simulateApiError("**/updateAdvertiserProfile");
  await advertiserProfilePage.submitForm();
  await myPage.expectApiErrorGracefulMessage();

  await myPage.simulateNetworkError("**/updateAdvertiserProfile");
  await advertiserProfilePage.submitForm();
  await myPage.expectNetworkErrorGracefulMessage();
});

test(`Admin can update other advertiser profile`, async ({ myPage }) => {
  await myPage.asAdvertiser();

  const advertiserDetailPage = await myPage.gotoAdvertiserDetail();
  const advertiserDetailUrl = await myPage.page.url();

  await myPage.asAdmin();
  await myPage.page.goto(advertiserDetailUrl);
  const advertiserProfilePage =
    await advertiserDetailPage.gotoAdvertiserProfile();
  await advertiserProfilePage.fillForm([
    {
      type: "fill",
      label: "Název",
      value: "advertiser - e2e admin updated",
    },
  ]);
  await advertiserProfilePage.submitForm();
  await advertiserProfilePage.expectSuccessfulSubmit();
});

const validFormData = [
  {
    type: "fill",
    label: "O vás",
    value: "test test",
  },
  {
    type: "fill",
    label: "Váš web",
    value: "https://test.cz",
  },
];
