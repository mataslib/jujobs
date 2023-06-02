import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useGetJobFilter = (options?: {
  queryOptions?: UseQueryOptions<
    Awaited<ReturnType<typeof api.getJobFilter>>,
    AxiosError<unknown>
  >;
}) => {
  const api = useApi();

  const queryResult = useQuery<
    Awaited<ReturnType<typeof api.getJobFilter>>,
    AxiosError<unknown>
  >({
    queryKey: ["getJobFilter"],
    queryFn: () => api.getJobFilter(),
    ...(options?.queryOptions || {}),
  });

  return {
    queryResult,
  };
};
