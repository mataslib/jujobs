import { titleDef } from "../../createUpdateJobFormData";
import { test } from "../../myTest";
import { UpdateJobPage } from "../../pageObjectModel/updateJobPage";

test(`Advertiser should be able to update his created job`, async ({
  myPage,
}) => {
  myPage.asAdvertiser();
  const { jobId } = await myPage.createJob();
  const updateJobPage = new UpdateJobPage(myPage);
  await updateJobPage.goto(jobId);

  await updateJobPage.fillForm([
    {
      ...titleDef,
      value: `updatedTitle`,
    },
  ]);
  await updateJobPage.submitForm();

  await updateJobPage.expectSuccessfulSubmit();
  await updateJobPage.goto(jobId);
  await myPage.expectInputHasValue(`Název pozice`, `updatedTitle`);
  console.log("ahoj");
});

test(`Prefill update job form > Should display api and network errors gracefully`, async ({
  myPage,
}) => {
  myPage.asAdvertiser();
  const { jobId } = await myPage.createJob();
  const updateJobPage = new UpdateJobPage(myPage);

  await myPage.simulateApiError("**/getJobView/*");
  await updateJobPage.goto(jobId);
  await myPage.expectApiErrorGracefulMessage();

  await myPage.simulateNetworkError("**/getJobView/*");
  await myPage.page.reload();
  await myPage.expectNetworkErrorGracefulMessage();
});

test(`Submit update job form > Should display api and network errors gracefully`, async ({
  myPage,
}) => {
  myPage.asAdvertiser();
  const { jobId } = await myPage.createJob();
  const updateJobPage = new UpdateJobPage(myPage);
  await updateJobPage.goto(jobId);
  await updateJobPage.fillForm([
    {
      ...titleDef,
      value: `updatedTitle`,
    },
  ]);

  await myPage.simulateApiError("**/updateJob");
  await updateJobPage.submitForm();
  await myPage.expectApiErrorGracefulMessage();

  await myPage.simulateNetworkError("**/updateJob");
  await updateJobPage.submitForm();
  await myPage.expectNetworkErrorGracefulMessage();
});

test(`admin can update other advertiser job`, async ({ myPage }) => {
  // createTestJobAsAdvertiser
  await myPage.asAdvertiser();
  const { jobCreatedPage } = await myPage.createJob();
  const jobDetailPage = await jobCreatedPage.gotoJobDetail();
  const jobDetailUrl = await jobDetailPage.page.url();

  await myPage.asAdmin();
  await myPage.page.goto(jobDetailUrl);
  const updateJobPage = await jobDetailPage.gotoUpdateJob();

  await updateJobPage.fillForm([
    {
      ...titleDef,
      value: "e2e test admin can update other advertiser job - updated",
    },
  ]);
  await updateJobPage.submitForm();
  await updateJobPage.expectSuccessfulSubmit();
});
