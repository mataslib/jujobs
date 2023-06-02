export function assertNotUndefined<T>(
  value: T
): asserts value is Exclude<T, undefined> {
  if (value === undefined) {
    throw new Error("Value is undefined");
  }
}

export function assertNotNull<T>(input: T): asserts input is Exclude<T, null> {
  if (input !== null) {
    return;
  }
  throw new Error("Not null asserted!");
}
