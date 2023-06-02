import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useUpdateJob = () => {
  const api = useApi();

  const updateJobMutation = useMutation<
    Awaited<ReturnType<typeof api.updateJob>>,
    AxiosError<unknown>,
    Parameters<typeof api.updateJob>[0]
  >({
    mutationFn: api.updateJob,
  });

  return updateJobMutation;
};
