import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Api, api } from "../infrastructure/api";
import { IPrefetcher } from "../util/prefetcher";
import { useApi } from "./useApi";

export const useListJobs = (options: {
  search?: ListJobsSearch;
  queryOptions?: UseQueryOptions<ListJobsData, AxiosError<unknown>>;
}) => {
  const api = useApi();

  const queryResult = useQuery<ListJobsData, AxiosError<unknown>>({
    queryKey: ["listJobs", options.search],
    queryFn: () => api.listJobs(options.search),
    ...(options?.queryOptions || {}),
  });

  return {
    queryResult,
  };
};

export const prefetchListJobs = async (
  prefetcher: IPrefetcher,
  search?: ListJobsSearch
) => {
  const filter = search;

  return prefetcher.prefetchQuery({
    queryKey: ["listJobs", filter],
    queryFn: () => api.listJobs(filter),
  });
};

export type ListJobsData = Awaited<ReturnType<Api["listJobs"]>>;
export type ListJobsSearch = Parameters<typeof api["listJobs"]>[0];
