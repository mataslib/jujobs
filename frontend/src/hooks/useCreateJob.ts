import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useCreateJob = () => {
  const api = useApi();

  const createJobMutation = useMutation<
    Awaited<ReturnType<typeof api.createJob>>,
    AxiosError<unknown>,
    Parameters<typeof api.createJob>[0]
  >({
    mutationFn: api.createJob,
  });

  return createJobMutation;
};
