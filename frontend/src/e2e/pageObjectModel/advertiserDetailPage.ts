import { Page } from "@playwright/test";
import { MyPage } from "../myPage";
import { UpdateAdvertiserProfilePage } from "./updateAdvertiserProfilePage";
import { CreateJobPage } from "./createJobPage";

export class AdvertiserDetailPage {
  readonly myPage: MyPage;
  readonly page: Page;

  constructor(myPage: MyPage) {
    this.myPage = myPage;
    this.page = myPage.page;
  }

  public async gotoAdvertiserProfile() {
    await Promise.all([
      this.page.waitForURL(`**/inzerent/*/profil`),
      this.page.click(`"Upravit profil"`),
    ]);
    return new UpdateAdvertiserProfilePage(this.myPage);
  }

  public async gotoCreateJob() {
    await Promise.all([
      this.page.waitForURL(`**/inzerent/*/nabidka/vytvorit`),
      this.page.click(`"Nový inzerát"`),
    ]);
    return new CreateJobPage(this.myPage);
  }
}
