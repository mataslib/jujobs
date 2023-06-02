import { Page } from "@playwright/test";
import { MyPage } from "../myPage";
import { JobDetailPage } from "./jobDetailPage";

export class JobCreatedPage {
  readonly myPage: MyPage;
  readonly page: Page;

  constructor(myPage: MyPage) {
    this.myPage = myPage;
    this.page = myPage.page;
  }

  public async gotoJobDetail() {
    await Promise.all([
      this.page.waitForURL(`**/nabidka/*`),
      this.page.click(`"Zobrazit nabídku"`),
    ]);
    return new JobDetailPage(this.myPage);
  }

  public getJobId() {
    // /nabidka/[jobId]/vytvoreno
    return this.page.url().split("/").reverse()[1];
  }
}
