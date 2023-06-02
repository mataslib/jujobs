import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Api, api } from "../infrastructure/api";
import { IPrefetcher } from "../util/prefetcher";
import { useApi } from "./useApi";

export const useListAdvertisers = (options: {
  search: ListAdvertisersSearch;
  queryOptions?: UseQueryOptions<ListAdvertisersData, AxiosError<unknown>>;
}) => {
  const [filter, setFilter] = useState<ListAdvertisersSearch>(
    options?.search ?? {}
  );
  const { listAdvertisers } = useApi();

  useEffect(() => {
    setFilter(options.search);
  }, [JSON.stringify(options.search)]);

  const queryResult = useQuery<ListAdvertisersData, AxiosError<unknown>>(
    ["listAdvertisers", filter],
    () => listAdvertisers(filter),
    options?.queryOptions
  );

  return {
    filter,
    setFilter,
    queryResult,
  };
};

export const prefetchListAdvertisers = async (
  prefetcher: IPrefetcher,
  filter?: any
) => {
  return prefetcher.prefetchQuery({
    queryKey: ["listAdvertisers", filter],
    queryFn: () => api.listAdvertisers(filter),
  });
};

export type ListAdvertisersData = Awaited<ReturnType<Api["listAdvertisers"]>>;
export type ListAdvertisersSearch = Parameters<
  typeof api["listAdvertisers"]
>[0];
