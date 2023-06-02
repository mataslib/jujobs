import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api, Api } from "../infrastructure/api";
import { IPrefetcher } from "../util/prefetcher";
import { useApi } from "./useApi";

export const useGetAdvertiserView = (props: {
  advertiserId: string | undefined;
  queryOptions?: UseQueryOptions<GetAdvertiserViewData, AxiosError<unknown>>;
}) => {
  const api = useApi();

  const queryResult = useQuery<GetAdvertiserViewData, AxiosError<unknown>>({
    queryKey: ["getAdvertiserView", props.advertiserId],
    queryFn: () => api.getAdvertiserView(props.advertiserId!),
    enabled: !!props.advertiserId,
    ...(props?.queryOptions || {}),
  });

  return {
    queryResult,
  };
};

export const prefetchGetAdvertiserView = async (
  prefetcher: IPrefetcher,
  advertiserId: string
) => {
  prefetcher.prefetchQuery({
    queryKey: ["getAdvertiserView", advertiserId],
    queryFn: () => api.getAdvertiserView(advertiserId),
  });

  return prefetcher;
};

export type GetAdvertiserViewData = Awaited<
  ReturnType<Api["getAdvertiserView"]>
>;
