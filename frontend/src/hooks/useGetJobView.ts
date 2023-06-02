import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Api, api } from "../infrastructure/api";
import { IPrefetcher } from "../util/prefetcher";
import { useApi } from "./useApi";

export const useGetJobView = (props: {
  jobId: string | undefined;
  queryOptions?: UseQueryOptions<GetJobViewData, AxiosError<unknown>>;
}) => {
  const api = useApi();

  const queryResult = useQuery<GetJobViewData, AxiosError<unknown>>({
    queryKey: ["getJobView", props.jobId],
    queryFn: () => api.getJobView(props.jobId!),
    enabled: !!props.jobId,
    ...(props?.queryOptions || {}),
    staleTime: 20000,
  });

  return {
    queryResult,
  };
};

export const prefetchGetJobView = async (
  prefetcher: IPrefetcher,
  jobId: string
) => {
  prefetcher.prefetchQuery({
    queryKey: ["getJobView", jobId],
    queryFn: () => api.getJobView(jobId),
  });

  return prefetcher;
};

export type GetJobViewData = Awaited<ReturnType<Api["getJobView"]>>;
