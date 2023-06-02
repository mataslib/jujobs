import { expect, test } from "../../myTest";

test("Jobs list should be accessible from homepage", async ({ myPage }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await myPage.page.goto("/");
  // Find an element with the text 'About Page' and click on it
  await myPage.page.click(`"nabídka pracovních pozic"`);
  // The new url should be "/about" (baseURL is used there)
  await myPage.waitForClientNavigation();
  await expect(myPage.page).toHaveURL("/nabidky/1");
});

test(`Filter should be filled with values from url`, async ({ myPage }) => {
  await myPage.page.goto(
    `/nabidky/hledat?employmentType[]=Plný%20úvazek&fulltext=Astronaut`
  );
  await myPage.expectInputHasValue("V názvu / textu", "Astronaut");
  await myPage.expectMultiSelectHasOptionSelected(`Druh úvazku`, "Plný úvazek");
});
