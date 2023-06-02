import { Page, expect } from "@playwright/test";
import { validFillFormDefinitions } from "../createUpdateJobFormData";
import type { FillFormDefinitions, MyPage } from "../myPage";

export class NotificationPage {
  readonly myPage: MyPage;
  readonly page: Page;
  constructor(myPage: MyPage) {
    this.myPage = myPage;
    this.page = myPage.page;
  }

  public async goto() {
    return this.myPage.page.goto(`/student/notifikace`);
  }

  public async isNotificationsTurnedOn() {
    return this.myPage.page.locator(`text=Notifikace jsou aktivní`).isVisible();
  }

  public async turnNotificationsOff() {
    return Promise.all([
      this.myPage.waitForRequestResolved("**/deleteNewJobNotificationConfig"),
      this.myPage.page.locator(`text=Nechci již dostávat notifikace`).click(),
    ]);
  }

  public async submitFormAndTurnNotificationsOn() {
    return Promise.all([
      this.myPage.waitForRequestResolved("**/saveNewJobNotificationConfig"),

      this.myPage.page.locator(`text=Uložit a dostávat notifikace`).click(),
    ]);
  }
  public async fillForm(
    fillFormData: FillFormDefinitions = validFillFormDefinitions
  ) {
    return this.myPage.fillForm(fillFormData);
  }

  public async expectSuccessfulNotificationsTurnedOn() {
    return expect(
      this.myPage.page.locator(`text=Notifikace jsou aktivní`)
    ).toBeVisible();
  }

  public async expectSuccessfulNotificationsTurnedOff() {
    return expect(
      this.myPage.page.locator(`text=Notifikace jsou vypnuté`)
    ).toBeVisible();
  }
}
