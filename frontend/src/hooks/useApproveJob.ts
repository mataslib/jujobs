import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useApproveJob = () => {
  const api = useApi();

  const approveJobMutation = useMutation<
    Awaited<ReturnType<typeof api.approveJob>>,
    AxiosError<unknown>,
    Parameters<typeof api.approveJob>[0]
  >({
    mutationFn: api.approveJob,
  });

  return approveJobMutation;
};
