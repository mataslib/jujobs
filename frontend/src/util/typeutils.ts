export type ExtractProps<TPropsFn extends (...args: any) => any> = Extract<
  Awaited<ReturnType<TPropsFn>>,
  { props: unknown }
>["props"];
