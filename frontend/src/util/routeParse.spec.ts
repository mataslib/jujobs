import { parsePathParams } from "./routeParse";

test.each([
  [
    "/first/second/[token]/third/[id]",
    "/first/second/tokenParam/third/idParam",
    {
      token: "tokenParam",
      id: "idParam",
    },
  ],
])(`parsePathParam parses correctly`, (pathSpec, pathCurrent, expected) => {
  expect(parsePathParams(pathSpec, pathCurrent)).toEqual(expected);
});
