// Derived from zod's .array required
// [
//   (
//     | "Dohoda o provedení práce"
//     | "Dohoda o provedení činnosti"
//     | "Pracovní smlouva"
//     | "OSVČ"
//     | "Stáž"
//     | "Praxe"
//   ),
//   ...(
//     | "Dohoda o provedení práce"
//     | "Dohoda o provedení činnosti"
//     | "Pracovní smlouva"
//     | "OSVČ"
//     | "Stáž"
//     | "Praxe"
//   )[]
// ];
export type ArrayAtLeastOne<TUnion> = [TUnion, ...TUnion[]];
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};
