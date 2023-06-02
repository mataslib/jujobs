import { Page, expect } from "@playwright/test";
import { validFillFormDefinitions } from "../createUpdateJobFormData";
import type { FillFormDefinitions, MyPage } from "../myPage";
import { ForgottenPasswordPage } from "./forgottenPasswordPage";

export class LoginPage {
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

  public async gotoForgottenPassword() {
    await Promise.all([
      this.page.waitForURL(`**/zapomenute-heslo`),
      this.page.click(`"Zapomenuté heslo"`),
    ]);
    return new ForgottenPasswordPage(this.myPage);
  }

  public async submitForm() {
    return Promise.all([
      this.myPage.waitForRequestResolved(`**/authenticate`),
      Promise.any([
        this.myPage.expectApiOrNetworkErrorAlert(),
        this.expectSuccessfulSubmit(),
      ]),
      this.page.click(`button[type="submit"] >> text="Přihlásit"`),
    ]);
  }

  public async expectSuccessfulSubmit() {
    return expect(this.page.locator(`text=Jste přihlášeni`)).toBeVisible();
  }
}
