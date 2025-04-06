export type PathParam<Path extends string> =
  Path extends `${infer L}/${infer R}`
    ? PathParam<L> | PathParam<R>
    : Path extends `:${infer Param}`
      ? Param
      : never;

export type Params<Path extends string> = { [key in PathParam<Path>]?: string };
