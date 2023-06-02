import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useArchiveJob = () => {
  const api = useApi();

  const archiveJobMutation = useMutation<
    Awaited<ReturnType<typeof api.archiveJob>>,
    AxiosError<unknown>,
    Parameters<typeof api.archiveJob>[0]
  >({
    mutationFn: api.archiveJob,
  });

  return archiveJobMutation;
};
