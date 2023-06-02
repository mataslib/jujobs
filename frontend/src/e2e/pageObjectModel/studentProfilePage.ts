import { Page } from "@playwright/test";
import type { MyPage } from "../myPage";
import { CreateStudyPage } from "./createStudyPage";
import { UpdateStudentPage } from "./updateStudentPage";
import { UpdateStudyPage } from "./updateStudyPage";

export class StudentProfilePage {
  readonly myPage: MyPage;
  readonly page: Page;
  constructor(myPage: MyPage) {
    this.myPage = myPage;
    this.page = myPage.page;
  }

  public async gotoUpdateProfile() {
    await Promise.all([
      this.page.waitForURL(`**/student/*/profil/upravit`),
      this.page.click(`"Upravit profil"`),
    ]);
    return new UpdateStudentPage(this.myPage);
  }

  public async gotoCreateStudy() {
    await Promise.all([
      this.page.waitForURL(`**/studium/vytvorit`),
      this.page.click(`"Přidat studium ručně"`),
    ]);
    return new CreateStudyPage(this.myPage);
  }

  public async gotoUpdateStudy() {
    await Promise.all([
      this.page.waitForURL(`**/student/*/studium/*/upravit`),
      this.page.locator(`a >> text="Upravit"`).first().click(),
    ]);
    return new UpdateStudyPage(this.myPage);
  }

  public async deleteStudy() {
    this.page.once("dialog", (confirmDeleteDialog) => {
      confirmDeleteDialog.accept();
    });
    await Promise.all([
      Promise.any([
        this.myPage.expectSuccessfulSubmitAlert(),
        this.myPage.expectApiOrNetworkErrorAlert(),
      ]),
      this.page.locator(`button >> text="Odstranit"`).first().click(),
    ]);
  }

  public async expectSuccessfulDeleteStudy() {
    return this.myPage.expectSuccessfulSubmitAlert();
  }

  public async gotoImportStudy() {
    await this.page.click(`text=Importovat studium ze stagu`);
  }
}
