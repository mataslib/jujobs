import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useReplyToJob = () => {
  const api = useApi();

  const replyToJobMutation = useMutation<
    Awaited<ReturnType<typeof api.replyToJob>>,
    AxiosError<unknown>,
    Parameters<typeof api.replyToJob>[0]
  >({
    mutationFn: api.replyToJob,
  });

  return replyToJobMutation;
};
