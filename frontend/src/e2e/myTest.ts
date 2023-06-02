import { Page, test as base } from "@playwright/test";
import { MyPage } from "./myPage";

console.log(`My playwright fixtures loaded!`);
// import { TodoPage } from "./todo-page";
// import { SettingsPage } from "./settings-page";

// Declare the types of your fixtures.
type MyFixtures = {
  myPage: MyPage;
  // page: MyPageOverride;
};

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
  myPage: async ({ page }, use) => {
    const myPage = new MyPage(page);
    await use(myPage);
  },
  // page: async ({ page }, use) => {
  //   console.log(`page fixture`);
  //   const myPage = toMyPage(page);
  //   myPage.ahoj();
  //   await use(myPage);
  // },
});

export { expect } from "@playwright/test";

// function toMyPage(page: Page): MyPageOverride {
//   (page as MyPageOverride).ahoj = function () {
//     console.log("ahoj");
//   };
//   return page as MyPageOverride;
// }
// export interface MyPageOverride extends Page {
//   ahoj(): void;
// }

// Potrebuju:
// - Anonymouse
// - Advertisera
// - Studenta
// - Absolventa
// - Admina
// Otazka je, kde je vezmu. Idealne projdu celej proces jejich tvorby, od registrace po prihlaseni.
// PagaObjectModel se podle dokumentace vytvari nova instance v kazdym testu, to znamena, ze asi nesdili zadna data.
// - ja ale potrebuju sdilet mezi testama.
// Zda se, ze moznosti je ukladat onen storage do souboru a nacitat v kazdym testu.

// MyPage(page).asAdvertiser()
// 1. spustim dev server (deploy)
// 2. vymazu db / nahraju fixtures
// 3. spustim e2e SETUP testy: vytvoreni uzivatelu
// |-> pokud bych to neudelal, muzu pouzivat asAdvertiser(), pokud neexistuje, zaregistruju/overim/... noveho
//     problem vsak je, protoze testy bezi concurrentne v izolovanych prostredich, tak muze dojit k race conditions, testy budou failovat apod.
//     proto bych rozdelil e2e testovani do dvou fazi, prave setupovaci a pote testovaci
//     vytvorene uzivatele pak muzu vzdy nove prihlasit, nebo muzu reusovat local storage.
// * tady je trochu problem, ze mozna budu potrebovat upravit i debuggovaci commandy. Kazdopadne ja ted db nemazu, takze je to asi jedno.
// |- chci vubec mazat databazi pro localhost?
//
// PageObjectModely muzu poskytnout jako fixture, vyhnu se tak potrebe je instancovat
// Fixtures take umoznuji prepsat defaultni, to je page, browser, context ,...
// Po vytvoreni fixtures vsak musim pouzivat muj novy exportovany test
// zajimave je, ze se funkce spousti tim, ze ji uvedu v parametru.
// Ve fixture musi dojit k zavolani funkce use! jinak nedojde ke spusteni testu.  https://playwright.dev/docs/api/class-test#test-use

// dalsi moznost je nastrkat do databaze fixtures uzivatelu, a pak jeste delat testy mimo.
// Obecne 1. fixtures vs 2. manualni vytvoreni
// 1. +Muzou rovnou bezet testy, casova uspora. -V case pri zmene schematu dat apod. bude potreba udrzovat i fixtures.
// 2. -Zdrzuje ostatni testy. +Opravdu proveri cely workflow jak bych ho udelal NOVY uzivatel (v pripade starych uzivatelu by mohlo dojit k chybe, mam jistotu pouze pro nove uzivatele. Napr. novyc uzivatele pozmenene shcema v DB, rozbije stare - neodhalim, protoze pouzivam noveho)
// ASi mi prijde lepsi moznost 2., testy navic pripadne muzu skippovat / spoustet nespoustet podle base url zda localhost a tak
