import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useUpdateAdvertiserProfile = () => {
  const api = useApi();

  const updateAdvertiserProfileMutation = useMutation<
    Awaited<ReturnType<typeof api.updateAdvertiserProfile>>,
    AxiosError<unknown>,
    Parameters<typeof api.updateAdvertiserProfile>[0]
  >({
    mutationFn: api.updateAdvertiserProfile,
  });

  return updateAdvertiserProfileMutation;
};
