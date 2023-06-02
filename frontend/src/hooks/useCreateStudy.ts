import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useCreateStudy = () => {
  const api = useApi();

  const createStudyMutation = useMutation<
    Awaited<ReturnType<typeof api.createStudy>>,
    AxiosError<unknown>,
    Parameters<typeof api.createStudy>[0]
  >({
    mutationFn: api.createStudy,
  });

  return createStudyMutation;
};
