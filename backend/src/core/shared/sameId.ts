/**
 * Allows comparing ObjectId with string ObjectId,
 * Allows comparing undefined|null values with ids
 *
 * @param id1
 * @param id2
 * @returns
 */
export function isSameId(id1: unknown, id2: unknown): boolean {
  if (!id1 || !id2) {
    return false;
  }

  const isSame = id1.toString() === id2.toString();
  return isSame;
}
