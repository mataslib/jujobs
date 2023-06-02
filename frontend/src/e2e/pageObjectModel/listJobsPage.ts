import { Page } from "@playwright/test";
import type { MyPage } from "../myPage";
import { JobDetailPage } from "./jobDetailPage";

export class ListJobsPage {
  readonly myPage: MyPage;
  readonly page: Page;

  constructor(myPage: MyPage) {
    this.myPage = myPage;
    this.page = myPage.page;
  }

  public async searchAndVisit(values: { fulltext: string }) {
    await this.page.type(`"V názvu / textu"`, values.fulltext);
    await this.page.click(`"Hledat"`);

    const titleLocator = this.page.locator(`"${values.fulltext}"`).first();
    await titleLocator.waitFor({ timeout: 5000 });
    await Promise.all([
      this.page.waitForURL(`**/nabidka/*`),
      titleLocator.click(),
    ]);
    return new JobDetailPage(this.myPage);
    // createdJobDetailUrl = await this.page.url();
  }
}
