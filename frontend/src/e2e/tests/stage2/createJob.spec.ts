import {
  titleDef,
  validFillFormDefinitions,
} from "../../createUpdateJobFormData";
import { test } from "../../myTest";

test("Advertiser should be able to create job", async ({ myPage }) => {
  await myPage.asAdvertiser();

  const createJobPage = await myPage.gotoCreateJob();
  await createJobPage.fillForm([
    ...validFillFormDefinitions,
    {
      ...titleDef,
      value: `e2e job`,
    },
  ]);
  await createJobPage.submitForm();
  await createJobPage.expectSuccessfulSubmit();
});

test(`Submit create job > Should display api and network errors gracefully`, async ({
  myPage,
}) => {
  await myPage.asAdvertiser();
  const createJobPage = await myPage.gotoCreateJob();
  await createJobPage.fillForm(validFillFormDefinitions);
  await myPage.simulateNetworkError(`**/createJob`);
  await createJobPage.submitForm();
  await myPage.expectNetworkErrorGracefulMessage();

  await myPage.simulateApiError(`**/createJob`);
  await createJobPage.submitForm();
  await myPage.expectApiErrorGracefulMessage();
});

test(`Admin should be able to create job as if other advertiser`, async ({
  myPage,
}) => {
  await myPage.asAdvertiser();
  const advertiserDetailPage = await myPage.gotoAdvertiserDetail();
  const advertiserDetailUrl = await advertiserDetailPage.page.url();

  await myPage.asAdmin();
  await myPage.page.goto(advertiserDetailUrl);
  const createJobPage = await advertiserDetailPage.gotoCreateJob();
  await createJobPage.fillForm([...validFillFormDefinitions]);
  await createJobPage.submitForm();
  await createJobPage.expectSuccessfulSubmit();
});

// await test.step("I should be able to find created job and view it's detail page", async () => {
//   await page.goto("/nabidky/1");
//   await page.type(`"V názvu / textu"`, `${jobId}`);

//   const repeatedFn = async () => {
//     for (let i = 0; i <= 6; i++) {
//       try {
//         await new Promise((resolve) => setTimeout(resolve, 5000));
//         await page.click(`"Hledat"`);
//         const titleLocator = page.locator(`text=${jobId}`).first();
//         await titleLocator.waitFor({ timeout: 5000 });
//         return titleLocator;
//       } catch (err) {
//         if (i >= 6) {
//           // last run
//           throw err;
//         }
//       }
//     }
//     return undefined as never;
//   };
//   const titleLocator = await repeatedFn();

//   await Promise.all([page.waitForNavigation(), titleLocator.click()]);
//   createdJobDetailUrl = await page.url();
// });

// await test.step(`Created job should be listed in my jobs list and I should be able to view it's detail`, async () => {
//   await myPage.gotoMyJobs();
//   const titleLocator = page.locator(`text=${jobId}`).first();
//   await titleLocator.waitFor({ timeout: 5000 });
//   await Promise.all([page.waitForNavigation(), titleLocator.click()]);
// });
