import { Page } from "@playwright/test";
import { MyPage } from "../myPage";
import { UpdateJobPage } from "./updateJobPage";

export class JobDetailPage {
  readonly myPage: MyPage;
  readonly page: Page;

  constructor(myPage: MyPage) {
    this.myPage = myPage;
    this.page = myPage.page;
  }

  public async gotoUpdateJob() {
    await Promise.all([
      this.page.waitForURL(`**/nabidka/*/upravit`),
      this.page.click(`"Upravit"`),
    ]);
    return new UpdateJobPage(this.myPage);
  }
}
