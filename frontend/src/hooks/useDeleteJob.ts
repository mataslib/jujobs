import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useDeleteJob = () => {
  const api = useApi();

  const deleteJobMutation = useMutation<
    Awaited<ReturnType<typeof api.deleteJob>>,
    AxiosError<unknown>,
    Parameters<typeof api.deleteJob>[0]
  >({
    mutationFn: api.deleteJob,
  });

  return deleteJobMutation;
};
