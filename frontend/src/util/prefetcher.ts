import {
  dehydrate,
  FetchQueryOptions,
  QueryClient,
} from "@tanstack/react-query";

class Prefetcher {
  private promises: Promise<any>[] = [];

  constructor(private queryClient: QueryClient) {}

  public prefetchQuery: QueryClient["prefetchQuery"] = (
    options: FetchQueryOptions
  ) => {
    const promise = this.queryClient.prefetchQuery(options);
    this.promises.push(promise);

    return promise;
  };

  public props = async () => {
    await Promise.all(this.promises);

    return {
      dehydratedState: dehydrate(this.queryClient),
    };
  };
}

export type IPrefetcher = Prefetcher;

export const createPrefetcher = () => new Prefetcher(new QueryClient());
