export type PaginatedResults<TResult> = {
  results: TResult[];
  meta: {
    total: number;
    page: number;
    pages: number;
    skip: number;
    limit: number;
  };
};
