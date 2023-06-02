import { Page } from "@playwright/test";
import { validFillFormDefinitions } from "../createUpdateJobFormData";
import type { FillFormDefinitions, MyPage } from "../myPage";
import { JobCreatedPage } from "./jobCreatedPage";

export class UserSettingsPage {
  readonly myPage: MyPage;
  readonly page: Page;
  constructor(myPage: MyPage) {
    this.myPage = myPage;
    this.page = myPage.page;
  }

  private get changeEmailBoxLocator() {
    return this.myPage.page.locator(`h3 >> text=Email >> xpath=..`);
  }
  private get changePasswordBoxLocator() {
    return this.myPage.page.locator(`h3 >> text=Heslo >> xpath=..`);
  }

  public async activateChangeEmailForm() {
    return this.changeEmailBoxLocator.locator(`text=změnit`).click();
  }
  public async fillChangeEmailForm(
    fillFormData: FillFormDefinitions = validFillFormDefinitions
  ) {
    return this.myPage.fillForm(fillFormData);
  }
  public async submitChangeEmailForm() {
    return Promise.all([
      this.myPage.waitForRequestResolved(`**/requestEmailChange`),
      Promise.any([
        this.myPage.expectApiOrNetworkErrorAlert(),
        this.expectSuccessfulChangeEmailFormSubmit(),
      ]),
      this.changeEmailBoxLocator.locator(`text=změnit`).click(),
    ]);
  }
  public async expectSuccessfulChangeEmailFormSubmit() {
    return this.myPage.page.waitForSelector(
      `text=Dokončete změnu navštívením odkazu, který jsme zaslali na váš nový email.`
    );
  }

  public async activateChangePasswordForm() {
    return this.changePasswordBoxLocator.locator(`text=změnit`).click();
  }
  public async fillChangePasswordForm(
    fillFormData: FillFormDefinitions = validFillFormDefinitions
  ) {
    return this.myPage.fillForm(fillFormData);
  }
  public async submitChangePasswordForm() {
    return Promise.all([
      this.myPage.waitForRequestResolved(`**/updateUser`),
      Promise.any([
        this.myPage.expectApiOrNetworkErrorAlert(),
        this.expectSuccessfulChangeEmailFormSubmit(),
      ]),
      this.changePasswordBoxLocator.locator(`text=změnit`).click(),
    ]);
  }
  public async expectSuccessfulChangePasswordFormSubmit() {
    return this.myPage.page.waitForSelector(`text=Uloženo`);
  }
}
