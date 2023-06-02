import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useDeleteStudy = () => {
  const api = useApi();

  const deleteStudyMutation = useMutation<
    Awaited<ReturnType<typeof api.deleteStudy>>,
    AxiosError<unknown>,
    Parameters<typeof api.deleteStudy>[0]
  >({
    mutationFn: api.deleteStudy,
  });

  return deleteStudyMutation;
};
