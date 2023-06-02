import { widthByLabel } from "./utils";

test.each([["Název", "calc(7ch + 46px)"]])(
  `widthByLabel`,
  (label, expected) => {
    expect(widthByLabel(label)).toBe(expected);
  }
);
