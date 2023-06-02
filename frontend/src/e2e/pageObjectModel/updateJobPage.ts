import { Page } from "@playwright/test";
import { validFillFormDefinitions } from "../createUpdateJobFormData";
import type { FillFormDefinitions, MyPage } from "../myPage";

export class UpdateJobPage {
  readonly myPage: MyPage;
  readonly page: Page;
  constructor(myPage: MyPage) {
    this.myPage = myPage;
    this.page = myPage.page;
  }

  public async goto(jobId: string) {
    await this.page.goto(`/nabidka/${jobId}/upravit`);
  }

  public async fillForm(
    fillFormDefinitions: FillFormDefinitions = validFillFormDefinitions
  ) {
    await this.myPage.fillForm(fillFormDefinitions);
  }

  public async submitForm() {
    return Promise.all([
      this.myPage.waitForRequestResolved(`**/updateJob`),
      Promise.any([
        this.expectSuccessfulSubmit(),
        this.myPage.expectApiOrNetworkErrorAlert(),
      ]),
      this.page.click(`"Odeslat ke schválení administrátorům"`),
    ]);
  }

  public async expectSuccessfulSubmit() {
    return this.page.waitForURL(`**/nabidka/*/upraveno`);
  }
}
