import {z} from 'zod';

/**
 * Created because of frontend, where in forms undefined (not-filled inputs)
 * in case of unions resulted in misleading messages "expected value xyz",
 * This makes it message "required" for undefined which is more appropriate.
 */
export const requiredUnion = <T>(zodUnion: z.ZodType<T>) => {
  return zodUnion.or(
    // hack -> I allow undefined in case value is undefined, so remaining unions are not validated,
    // then I disallow undefined in refine and return error that value is required -> must not be undefined
    z.literal(undefined).refine(
      val => {
        if (val === undefined) {
          return false;
        }
        return true;
      },
      {
        message: 'required',
      }
    ) as unknown as z.ZodType<never>
    // as z.ZodType<never> is hack to omit added undefined which will result in required error from infered type
    // making union1 | union2 | undefined into union1 | union2
  );
};

/**
 * Workaround for https://github.com/colinhacks/zod/issues/635
 * - .optional results in { someKey?: string|undefined } which is not correct,
 * in Api, not present key has different meaning than value undefined:
 * A) value is undefined: value should be set to undefined (eg to DB)
 * B) key with value is missing: nothing concerning key should happen
 */
function refineNotUndefined<T>(value: any): value is T {
  return value !== undefined;
}

// regex from https://regex101.com/library/wit53C?orderBy=RELEVANCE&search=image+base64
function refineBase64Image(value: any): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  return /^data\:(?<type>image\/(png|tiff|jpg|gif|jpeg|bmp));base64,(?<data>[a-zA-Z0-9\+\/\=]*)$/.test(
    value
  );
}

export const base64ImageRegex = () => {
  return /^data\:(?<type>image\/(png|tiff|jpg|gif|jpeg|bmp));base64,(?<data>[a-zA-Z0-9\+\/\=]*)$/;
};

export const mongoIdRegex = () => {
  return /[0-9a-fA-F]{24}/;
};

