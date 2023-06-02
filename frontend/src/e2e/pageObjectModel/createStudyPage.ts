import { Page } from "@playwright/test";
import { validFillFormDefinitions } from "../createUpdateJobFormData";
import type { FillFormDefinitions, MyPage } from "../myPage";

export class CreateStudyPage {
  readonly myPage: MyPage;
  readonly page: Page;
  constructor(myPage: MyPage) {
    this.myPage = myPage;
    this.page = myPage.page;
  }

  public async fillForm(
    fillFormDefinitions: FillFormDefinitions = validFillFormDefinitions
  ) {
    return this.myPage.fillForm(fillFormDefinitions);
  }

  public async submitForm() {
    const results = await Promise.all([
      this.myPage.waitForRequestResolved(`**/createStudy`),
      Promise.any([
        this.expectSuccessfulSubmit(),
        this.myPage.expectApiOrNetworkErrorAlert(),
      ]),
      this.page.click(`button[type="submit"] >> text=Vytvořit`),
    ]);
  }

  public async expectSuccessfulSubmit() {
    return this.myPage.expectSuccessfulSubmitAlert();
  }
}
