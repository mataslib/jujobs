// inspirace odtud https://dbartholomae.github.io/lambda-middleware/

import {PartialOnUndefinedDeep} from 'type-fest';

// z https://stackoverflow.com/questions/50011616/typescript-change-function-type-so-that-it-returns-new-value
export type ReplaceFnReturnType<T extends (...a: any) => any, TNewReturn> = (
  ...a: Parameters<T>
) => TNewReturn;

// nahradit built-in Awaited
export type UnPromisify<T> = T extends Promise<infer U> ? U : T;
export type MaybePromise<T> = Promise<T> | T;
export type NotValidatedInput = {
  [key: string]: unknown;
};

/**
 * User may pass just anything, we want to use expected type for documentation purposes.
 * But we also must use unknown, since we don't know what user will actually pass.
 * And we wan't to defend ourselves from using non-validated data.
 * In other words force us to validate or be aware of dangerous input.
 *
 * We cant write `TExpected | unknown` sice unknown is so broad (any value) that it
 * would override TExpected and resulted into `unknown` type.
 *
 * There is still issue, that we suppose that object will be passed which may not be true.
 * In later case, unexpected error will be probably returned.
 */
export type UserInput<TValidInput> = TValidInput | NotValidatedInput;

/**
 * makes nullish if undefined {key: number | undefined} -> {key: number | undefined | null}
 */
type MakeUndefinedNullish<T> = {
  [K in keyof T]: T[K] extends Exclude<T[K], undefined> ? T[K] : T[K] | null;
};

/**
 * Udela z {key: number | undefined} -> {key?: number | undefined} - takze je pak validni neuvest klic
 * Udela z {key: undefined} -> {key: undefined | null} - protoze pri insertu klice s hodnotou undefined se z db vrati null, pokud klic insertovan nebyl, tak se vrati undefined
 *
 * Protoze nodejs prevadi undefined na null,
 * musime ke vsem undefined pripojit null,
 * protoze to se ve skutecnosti bude vracet z DB.
 */
// export type NormalizeDocument<TDoc> = MakeUndefinedNullish<
// PartialOnUndefinedDeep<TDoc>
// >;

export type NormalizeDocument<TDoc> = PartialOnUndefinedDeep<TDoc>;
// MakeUndefinedNullish<>;

// type TestDoc = {
//   ahoj?: number;
//   test: {zdar?: string}[] | undefined;
// };

// type TestNrmalized = NormalizeDocument<TestDoc>;
