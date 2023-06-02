import { test, expect } from "../myTest";

test(`test`, async ({ myPage }) => {
  await myPage.page.goto(`/`);
});
