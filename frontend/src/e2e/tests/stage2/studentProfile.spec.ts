import { v4 as uuid } from "uuid";
import { FillFormDefinitions } from "../../myPage";
import { test, expect } from "../../myTest";

test(`View student profile page > Should display network and api error gracefully`, async ({
  myPage,
}) => {
  await myPage.asStudent();
  await myPage.simulateNetworkError(`**/getStudent/*`);
  await myPage.gotoStudentProfile();
  await myPage.expectNetworkErrorGracefulMessage();
});

test(`Student can update it's profile data`, async ({ myPage }) => {
  await myPage.asStudent();

  const updateProfilePage = await myPage.gotoUpdateStudentProfile();

  const formData = validFormData();
  await updateProfilePage.fillForm(formData);
  await updateProfilePage.submitForm();
  await updateProfilePage.expectSuccessfulSubmit();

  // form is prefilled with updated values
  await myPage.page.reload();
  await myPage.expectInputContainValue("Odkaz na linkedin", formData[0].value);
  await myPage.expectInputContainValue("Odkaz na životopis", formData[1].value);

  // student profile page displays updated values
  await myPage.gotoStudentProfile();
  await myPage.page.waitForSelector(`text=${formData[0].value}`);
  await myPage.page.waitForSelector(`text=${formData[1].value}`);
});

test(`Submit update student profile form > Should display network and api error gracefully`, async ({
  myPage,
}) => {
  await myPage.asStudent();
  const updateProfilePage = await myPage.gotoUpdateStudentProfile();
  const formData = validFormData();
  await updateProfilePage.fillForm(formData);

  await myPage.simulateNetworkError(`**/updateStudent`);
  await updateProfilePage.submitForm();
  await myPage.expectNetworkErrorGracefulMessage();

  await myPage.simulateApiError(`**/updateStudent`);
  await updateProfilePage.submitForm();
  await myPage.expectApiErrorGracefulMessage();
});

test(`Prefill update student profile form > Should display network and api error gracefully`, async ({
  myPage,
}) => {
  await myPage.asStudent();
  const studentProfilePage = await myPage.gotoStudentProfile();

  await myPage.simulateNetworkError(`**/getStudent/*`);
  const updateProfilePage = await studentProfilePage.gotoUpdateProfile();
  await myPage.expectNetworkErrorGracefulMessage();
});

test.only(`Student can manually create study record, it is marked as created/updated by student, study record can be updated, deleted`, async ({
  myPage,
}) => {
  await myPage.asStudent();
  const studentProfilePage = await myPage.gotoStudentProfile();
  const createStudyPage = await studentProfilePage.gotoCreateStudy();
  await createStudyPage.fillForm([
    {
      type: "fill",
      label: "Název studovaného programu",
      value: "Testovací program",
    },
    {
      type: "select",
      label: "Fakulta",
      value: "Přírodovědecká fakulta",
    },
    {
      type: "select",
      label: "Typ studia",
      value: "Bakalářské",
    },
    {
      type: "clickText",
      text: "Přidat předmět",
    },
    {
      type: "fill",
      label: "Název předmětu",
      value: "Testovací předmět",
    },
    {
      type: "select",
      label: "Známka",
      value: "Splněno",
    },
  ]);
  await createStudyPage.submitForm();
  await createStudyPage.expectSuccessfulSubmit();

  // Expect created study
  await myPage.gotoStudentProfile();
  await expect(myPage.page.locator(`text=Testovací program`)).toBeVisible();
  await expect(
    myPage.page.locator(`text=Neověřené (zadáno nebo upraveno ručně studentem)`)
  ).toBeVisible();
  await expect(myPage.page.locator(`text=Testovací předmět`)).toBeVisible();
  await expect(myPage.page.locator(`text=Splněno`)).toBeVisible();
  await expect(myPage.page.locator(`text=Bakalářské`)).toBeVisible();
  await expect(
    myPage.page.locator(`text=Přírodovědecká fakulta`)
  ).toBeVisible();

  // Test update study
  const updateStudyPage = await studentProfilePage.gotoUpdateStudy();
  await updateStudyPage.fillForm([
    {
      type: "fill",
      label: "Název studovaného programu",
      value: "Upravený program",
    },
    {
      type: "select",
      label: "Fakulta",
      value: "Pedagogická fakulta",
    },
    {
      type: "select",
      label: "Typ studia",
      value: "Magisterské",
    },
    {
      type: "fill",
      label: "Název předmětu",
      value: "Upravený předmět",
    },
    {
      type: "select",
      label: "Známka",
      value: "Nesplněno",
    },
  ]);
  await updateStudyPage.submitForm();
  await updateStudyPage.expectSuccessfulSubmit();

  // Expect updates study
  await myPage.gotoStudentProfile();
  await expect(myPage.page.locator(`text=Upravený program`)).toBeVisible();
  await expect(
    myPage.page.locator(`text=Neověřené (zadáno nebo upraveno ručně studentem)`)
  ).toBeVisible();
  await expect(myPage.page.locator(`text=Upravený předmět`)).toBeVisible();
  await expect(myPage.page.locator(`text=Nesplněno`)).toBeVisible();
  await expect(myPage.page.locator(`text=Magisterské`)).toBeVisible();
  await expect(myPage.page.locator(`text=Pedagogická fakulta`)).toBeVisible();

  await studentProfilePage.deleteStudy();
  await studentProfilePage.expectSuccessfulDeleteStudy();
});

const validFormData = () => {
  const randLinkedin = uuid();
  const randCv = uuid();
  return [
    {
      type: "fill",
      label: "Odkaz na linkedin",
      value: `https://www.linkedin.com/in/${randLinkedin}/`,
    },
    {
      type: "fill",
      label: "Odkaz na životopis",
      value: `https://drive.google.com/file/d/${randCv}/view`,
    },
  ];
};
