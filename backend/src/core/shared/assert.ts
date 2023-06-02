export function assertNotUndefined<T>(
  value: T
): asserts value is Exclude<T, undefined> {
  if (value === undefined) {
    throw new Error('Not undefined asserted!');
  }
}

export function assertNotNull<T>(input: T): asserts input is Exclude<T, null> {
  if (input !== null) {
    return;
  }
  throw new Error('Not null asserted!');
}

export async function assertGetThrow(fn: () => any) {
  try {
    await fn();
    fail(`Error expected`);
  } catch (err) {
    return err;
  }
}
