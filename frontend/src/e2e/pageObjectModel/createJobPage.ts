import { Page, expect } from "@playwright/test";
import { validFillFormDefinitions } from "../createUpdateJobFormData";
import type { FillFormDefinitions, MyPage } from "../myPage";
import { JobCreatedPage } from "./jobCreatedPage";

export class CreateJobPage {
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
      this.myPage.waitForRequestResolved(`**/createJob`),
      Promise.any([
        this.expectSuccessfulSubmit(),
        this.myPage.expectApiOrNetworkErrorAlert(),
      ]),
      this.page.click(`"Odeslat ke schválení administrátorům"`),
    ]);

    return {
      jobCreatedPage: results[0].response?.ok()
        ? new JobCreatedPage(this.myPage)
        : null,
    };
  }

  public async expectSuccessfulSubmit() {
    return this.page.waitForURL(`**/nabidka/*/vytvoreno`);
  }
}
