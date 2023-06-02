import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Api } from "src/infrastructure/api";
import { useApi } from "./useApi";

export const useGetStudent = (props: {
  studentId: string | undefined;
  queryOptions?: UseQueryOptions<
    Awaited<ReturnType<typeof api.getStudent>>,
    AxiosError<unknown>
  >;
}) => {
  const api = useApi();

  const queryResult = useQuery<
    Awaited<ReturnType<typeof api.getStudent>>,
    AxiosError<unknown>
  >({
    queryKey: ["getStudent", props.studentId],
    queryFn: () => api.getStudent(props.studentId!),
    enabled: !!props.studentId,
    ...(props.queryOptions || {}),
  });

  return {
    queryResult,
  };
};

export type GetStudentData = Awaited<ReturnType<Api["getStudent"]>>;
