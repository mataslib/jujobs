import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useRegisterAdvertiser = () => {
  const api = useApi();

  const registerAdvertiserMutation = useMutation<
    Awaited<ReturnType<typeof api.registerAdvertiser>>,
    AxiosError<unknown>,
    Parameters<typeof api.registerAdvertiser>[0]
  >({
    mutationFn: api.registerAdvertiser,
  });

  return registerAdvertiserMutation;
};
