import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useUpdateStudent = () => {
  const api = useApi();

  const updateStudentMutation = useMutation<
    Awaited<ReturnType<typeof api.updateStudent>>,
    AxiosError<unknown>,
    Parameters<typeof api.updateStudent>[0]
  >({
    mutationFn: api.updateStudent,
  });

  return updateStudentMutation;
};
