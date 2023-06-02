import { Page, expect } from "@playwright/test";
import { assertNotNull } from "../util/assert";
import { validFillFormDefinitions } from "./createUpdateJobFormData";
import { AdvertiserDetailPage } from "./pageObjectModel/advertiserDetailPage";
import { UpdateAdvertiserProfilePage } from "./pageObjectModel/updateAdvertiserProfilePage";
import { CreateJobPage } from "./pageObjectModel/createJobPage";
import { ListJobsPage } from "./pageObjectModel/listJobsPage";
import { LoginPage } from "./pageObjectModel/loginPage";
import { StudentProfilePage } from "./pageObjectModel/studentProfilePage";
import { UserSettingsPage } from "./pageObjectModel/userSettingsPage";
import { NewJobNotificationPage } from "./pageObjectModel/newJobNotificationPage";

export class MyPage {
  public async expectSuccessfulSubmitAlert() {
    return expect(this.page.locator(`text=Úspěch`)).toBeVisible();
  }
  public async expectApiOrNetworkErrorAlert() {
    return Promise.any([
      this.expectApiErrorGracefulMessage(),
      this.expectNetworkErrorGracefulMessage(),
    ]);
  }
  public async gotoHomepage() {
    return this.page.goto("/");
  }

  // this.gettingStartedHeader = page.locator('h1', { hasText: 'Getting started' });
  // this.pomLink = page.locator('li', { hasText: 'Playwright Test' }).locator('a', { hasText: 'Page Object Model' });
  // this.tocList = page.locator('article ul > li > a');
  public async simulateApiError(url: Parameters<Page["route"]>[0]) {
    return this.page.route(
      url,
      (route) =>
        route.fulfill({
          status: 500,
          // serverErrorResponse(NotFoundDto)
          body: JSON.stringify({
            error: {
              type: "UnexpectedError",
              message: "Unexpected error",
              statusCode: 500,
            },
          }),
        }),
      {
        times: 1,
      }
    );
  }

  public async expectApiErrorGracefulMessage() {
    return expect(this.page.locator(`text=Neočekávaná chyba`)).toBeVisible();
  }

  public async simulateNetworkError(url: Parameters<Page["route"]>[0]) {
    return this.page.route(url, (route) => route.abort(), {
      times: 1,
    });
  }

  /**
   * I want to waitForResponse but it doesn't work (trigger) when page is intercepted and aborted
   * (eg during simulateApiError method).
   * This method works even for network errors.
   *
   * @param url
   * @returns
   */
  public async waitForRequestResolved(
    url: Parameters<Page["waitForRequest"]>[0]
  ) {
    return this.page.waitForRequest(url).then(async (request) => {
      const response = await request.response();
      return { request, response };
    });
  }

  public async expectNetworkErrorGracefulMessage() {
    return expect(this.page.locator(`text=ERR_NETWORK`)).toBeVisible();
  }
  public async expectMultiSelectHasOptionSelected(label: string, text: string) {
    const { labelParentLocator } = await this.locatorsByLabel(label);
    const selectedOptionLocator = labelParentLocator.locator(`text=${text}`);

    await expect(selectedOptionLocator).toBeVisible();
  }
  public async expectInputHasValue(label: string, value: string) {
    const { inputLocator } = await this.locatorsByLabel(label);
    const inputValue = await inputLocator.inputValue();
    await expect(inputValue).toBe(value);
  }

  public async expectInputContainValue(label: string, value: string) {
    const { inputLocator } = await this.locatorsByLabel(label);
    const inputValue = await inputLocator.inputValue();
    await expect(inputValue).toContain(value);
  }

  public readonly page: Page;
  // readonly getStartedLink: Locator;
  // readonly gettingStartedHeader: Locator;
  // readonly pomLink: Locator;
  // readonly tocList: Locator;

  private loggedInAs?: "advertiser" | "admin" | "student";

  constructor(page: Page) {
    this.page = page;
    // this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    // this.gettingStartedHeader = page.locator('h1', { hasText: 'Getting started' });
    // this.pomLink = page.locator('li', { hasText: 'Playwright Test' }).locator('a', { hasText: 'Page Object Model' });
    // this.tocList = page.locator('article ul > li > a');
  }

  private async asRole(role: "advertiser" | "admin" | "student") {
    if (this.loggedInAs === role) {
      return;
    }

    if (await this.isLoggedIn()) {
      await this.logout();
      this.loggedInAs = undefined;
    }

    await this.passwordLogin(users[role]);
    this.loggedInAs = role;
  }

  public async locatorsByLabel(label: string) {
    const labelLocator = this.page.locator(`label:has-text("${label}")`);
    const labelParentLocator = labelLocator.locator(`xpath=..`);
    const labelFor = await labelLocator.getAttribute("for");
    const inputLocator = this.page.locator(`[id="${labelFor}"]`);
    return {
      labelParentLocator,
      labelLocator,
      inputLocator,
    };
  }

  public async selectOptionByLabels(selectLabel: string, valueLabel: string) {
    const labelLocatorString = `label:has-text("${selectLabel}")`;
    const labelLocator = this.page.locator(labelLocatorString);
    const selectDropdownTriggerLocator = this.page.locator(
      `${labelLocatorString} + div`
    );
    // const controlLocator = labelLocator.locator(`xpath=parent::*`);
    const optionLocator = this.page.locator(
      `.MuiPopover-root [role="option"] >> "${valueLabel}"`
    ); // option is at end of body as absolute popover
    // const labelSelector = `label:has-text("${selectLabel}")`;
    await selectDropdownTriggerLocator.click({ force: true }); // click through label - triggers select
    await optionLocator.click();
    await this.page.keyboard.press("Tab"); // tabs closes dropdown
    await optionLocator.waitFor({ state: "hidden" });
  }

  public async fillForm(fillFormDefinitions: FillFormDefinitions) {
    const self = this;
    // hotfixes an issue where tests is too fast
    // and there is multiple page (re)renders due to _app key={router.route} change
    // which resets rhf form state, so already filled fields are cleared out
    await new Promise((resolve) => setTimeout(resolve, 2000));

    for (const definition of fillFormDefinitions) {
      if (definition.type === "fill") {
        await executeFillDefinition(definition);
      } else if (definition.type === "type") {
        await executeTypeDefinition(definition);
      } else if (definition.type === "select") {
        await executeSelectDefinition(definition);
      } else if (definition.type === "clickText") {
        await executeClickTextDefinition(definition);
      }
    }

    async function executeTypeDefinition(typeDefinition: TypeDefinition) {
      return self.page.type(`"${typeDefinition.label}"`, typeDefinition.value);
    }

    async function executeFillDefinition(fillDefinition: FillDefinition) {
      return self.page.fill(
        `label >> text=${fillDefinition.label}`,
        fillDefinition.value
      );
    }

    async function executeSelectDefinition(selectDefinition: SelectDefinition) {
      return self.selectOptionByLabels(
        selectDefinition.label,
        selectDefinition.value
      );
    }

    async function executeClickTextDefinition(
      clickTextDefinition: ClickTextDefinition
    ) {
      return self.page.click(`"${clickTextDefinition.text}"`);
    }
  }

  public async asAdvertiser() {
    return this.asRole("advertiser");
  }

  public async asStudent() {
    return this.asRole("student");
  }

  public async asAdmin() {
    return this.asRole("admin");
  }

  public async asStudentAdvertiser() {}

  public async asAbsolvent() {}

  public async isLoggedIn() {
    return this.page.isVisible(`[data-user-dropdown]`);
  }

  async logout() {
    await this.openUserDropdown();
    await this.page.click(`"Odhlásit"`);
  }

  public async openUserDropdown() {
    await this.page.click(`[data-user-dropdown]`);
  }

  public async gotoUserSettings() {
    await this.openUserDropdown();
    await Promise.all([
      this.waitForClientNavigation(),
      this.page.click(`"Nastavení"`),
    ]);
    return new UserSettingsPage(this);
  }

  public async gotoUpdateAdvertiserProfile() {
    await this.openUserDropdown();
    await Promise.all([
      this.waitForClientNavigation(),
      this.page.click(`"Upravit profil"`),
    ]);
    return new UpdateAdvertiserProfilePage(this);
  }

  public async gotoStudentProfile() {
    await this.openUserDropdown();
    await Promise.all([
      this.waitForClientNavigation(),
      this.page.click(`"Profil"`),
    ]);
    return new StudentProfilePage(this);
  }

  public async gotoUpdateStudentProfile() {
    const studentProfilePage = await this.gotoStudentProfile();
    // const studentProfilePage.
    // return new StudentProfilePage(this);
    return studentProfilePage.gotoUpdateProfile();
  }

  public async gotoNewJobNotificationConfig() {
    await this.openUserDropdown();
    await Promise.all([
      this.waitForClientNavigation(),
      this.page.click(`"Notifikace"`),
    ]);
    return new NewJobNotificationPage(this);
  }

  public async gotoAdvertiserDetail() {
    await this.openUserDropdown();
    await Promise.all([
      this.waitForClientNavigation(),
      this.page.click(`"Mé inzeráty"`),
    ]);
    return new AdvertiserDetailPage(this);
  }

  public async gotoListJobs() {
    await Promise.all([
      this.waitForClientNavigation(),
      this.page.click(`"Nabídka pracovních pozic"`),
    ]);
    return new ListJobsPage(this);
  }

  public async gotoMyJobs() {
    await this.openUserDropdown();
    await Promise.all([
      this.waitForClientNavigation(),
      this.page.click(`"Mé inzeráty"`),
    ]);
  }

  public async gotoCreateJob() {
    await this.openUserDropdown();
    await Promise.all([
      this.waitForClientNavigation(),
      this.page.click(`"Nový inzerát"`),
    ]);
    return new CreateJobPage(this);
  }

  public async gotoLogin() {
    await Promise.all([
      this.waitForClientNavigation(),
      this.page.click(`"Přihlásit"`),
    ]);
    return new LoginPage(this);
  }

  async passwordLogin(userData: { email: string; password: string }) {
    await this.page.goto(`/prihlaseni`);
    await this.page.fill(`"Email"`, userData.email);
    await this.page.fill(`"Heslo"`, userData.password);
    await this.page.click(`form button:has-text("Přihlásit")`);
    await this.page.waitForSelector(`"Jste přihlášeni"`);
  }

  // https://lab.amalitsky.com/posts/2022/wait-for-single-page-navigation-and-re-hydration-playwright-react/
  // client code has to emit custom event on window object
  public async waitForClientNavigation(): Promise<void> {
    return this.page.evaluate(async () => {
      return new Promise((resolve, reject) => {
        let resolved = false;

        const eventListener = (event: Event): void => {
          // very lax check for TSC (typescript compiler)
          if (event instanceof CustomEvent) {
            resolved = true;

            // promise with be resolved with the URL pathname
            resolve();
          }
        };

        window.addEventListener(
          "routeChangeComplete",
          eventListener,
          { once: true } // this is (at most) one time use event handler
        );

        // cleanup in case of timeout or non-event
        setTimeout(() => {
          window.removeEventListener("routeChangeComplete", eventListener);

          if (!resolved) {
            reject(Error("Expected client navigation - timed out"));
          }
        }, 10000); // timeout value better match playwright's timeout
      });
    });
  }

  public async createJob() {
    const createJobPage = await this.gotoCreateJob();

    await createJobPage.fillForm([...validFillFormDefinitions]);
    const { jobCreatedPage } = await createJobPage.submitForm();
    await createJobPage.expectSuccessfulSubmit();
    assertNotNull(jobCreatedPage);

    return {
      jobId: jobCreatedPage.getJobId(),
      jobCreatedPage: jobCreatedPage,
    };
  }

  // async goto() {
  //   await this.page.goto('https://playwright.dev');
  // }

  // async getStarted() {
  //   await this.getStartedLink.first().click();
  //   await expect(this.gettingStartedHeader).toBeVisible();
  // }

  // async pageObjectModel() {
  //   await this.getStarted();
  //   await this.pomLink.click();
  // }
}

const users = {
  advertiser: {
    email: "advertiserUser@jujobs.cz",
    password: "testtest",
  },
  admin: {
    email: "universityAdminUser@jujobs.cz",
    password: "testtest",
  },
  student: {
    email: "studentUser@jujobs.cz",
    password: "testtest",
  },
};

export type TypeDefinition = {
  type: "type";
  label: string;
  value: any;
};

export type FillDefinition = {
  type: "fill";
  label: string;
  value: any;
};

export type SelectDefinition = {
  type: "select";
  label: string;
  value: string;
};

export type ClickTextDefinition = {
  type: "clickText";
  text: string;
};

export type FillFormDefinitions = (
  | TypeDefinition
  | FillDefinition
  | SelectDefinition
  | ClickTextDefinition
)[];
