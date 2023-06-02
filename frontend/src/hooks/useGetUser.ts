import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Api } from "../infrastructure/api";
import { useApi } from "./useApi";

export const useGetUser = (props: {
  userId: string | undefined;
  queryOptions?: UseQueryOptions<GetUserData, AxiosError<unknown>>;
}) => {
  const api = useApi();

  const queryResult = useQuery<GetUserData, AxiosError<unknown>>({
    queryKey: ["getUser", props.userId],
    queryFn: () => api.getUser(props.userId!),
    enabled: !!props.userId,
    ...(props?.queryOptions || {}),
  });

  return {
    queryResult,
  };
};

export type GetUserData = Awaited<ReturnType<Api["getUser"]>>;
