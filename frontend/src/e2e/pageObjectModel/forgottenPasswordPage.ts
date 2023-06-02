import { Page } from "@playwright/test";
import { validFillFormDefinitions } from "../createUpdateJobFormData";
import type { FillFormDefinitions, MyPage } from "../myPage";
import { JobCreatedPage } from "./jobCreatedPage";

export class ForgottenPasswordPage {
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
      this.myPage.page.waitForResponse("**/requestForgottenPassword"),
      Promise.any([
        this.myPage.expectApiOrNetworkErrorAlert(),
        this.expectSuccessfulSubmit(),
      ]),
      this.page.click(`"Obnovit heslo"`),
    ]);
  }

  public async expectSuccessfulSubmit() {
    return this.myPage.page.waitForSelector(
      `text=Zkontrolujte svůj email a postupujte dle instrukcí.`
    );
  }
}
