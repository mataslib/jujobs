import { validFillFormDefinitions } from "../createUpdateJobFormData";
import type { FillFormDefinitions, MyPage } from "../myPage";
import { Page, expect } from "@playwright/test";

export class UpdateAdvertiserProfilePage {
  readonly myPage: MyPage;
  readonly page: Page;
  constructor(myPage: MyPage) {
    this.myPage = myPage;
    this.page = myPage.page;
  }

  public async fillForm(
    fillFormData: FillFormDefinitions = validFillFormDefinitions
  ) {
    return this.myPage.fillForm(fillFormData);
  }

  public async submitForm() {
    return Promise.all([
      this.myPage.waitForRequestResolved("**/updateAdvertiserProfile"),
      Promise.any([
        this.myPage.expectSuccessfulSubmitAlert(),
        this.myPage.expectApiOrNetworkErrorAlert(),
      ]),
      await this.page.click(`"Uložit"`),
    ]);
  }

  public async expectSuccessfulSubmit() {
    return this.myPage.expectSuccessfulSubmitAlert();
  }
}
