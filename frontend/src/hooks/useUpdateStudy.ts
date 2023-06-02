import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useUpdateStudy = () => {
  const api = useApi();

  const updateStudyMutation = useMutation<
    Awaited<ReturnType<typeof api.updateStudy>>,
    AxiosError<unknown>,
    Parameters<typeof api.updateStudy>[0]
  >({
    mutationFn: api.updateStudy,
  });

  return updateStudyMutation;
};
