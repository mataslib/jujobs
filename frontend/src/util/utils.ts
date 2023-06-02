import queryStringLib from "query-string";
import { UseFormReturn } from "react-hook-form";

export function widthByLabel(label: string) {
  // 46px componsate padding of input
  // |- size prop "small"... has effect only on input height, does not affect it's padding

  // |- preventively compensate 2 char for required mark (' *');
  // |- I could make it required prop dependent
  return `calc(${label.length + 2 + "ch"} + 46px)`;
}

export function isHttpSuccess(status: number) {
  return status >= 200 && status < 300;
}

export class FetchFail extends Error {
  message: string = "Neočekávaná chyba.";
  detail: any;
}

// todo: queryStringLib.stringify extract into shared - it is server-client common
export function stringifyQuerystring(obj: object) {
  return queryStringLib.stringify(obj, { arrayFormat: "bracket" });
}

export function parseQuerystring(queryString: string) {
  return queryStringLib.parse(queryString, {
    arrayFormat: "bracket",
    parseBooleans: true,
    parseNumbers: true,
  });
}

export function parsedQuerystring() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const parsed = parseQuerystring(window.location.search);
  if (Object.values(parsed).length <= 0) {
    return undefined;
  }

  return parsed;
}

export function formHasValues(usedForm: UseFormReturn) {
  const values = usedForm.getValues();
  return Object.keys(values).length > 0;
}

export function withConfirm(handler: () => void, message: string) {
  return () => {
    if (confirm(message)) {
      handler();
    }
  };
}
