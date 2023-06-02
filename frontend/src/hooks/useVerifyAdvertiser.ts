import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useVerifyAdvertiser = () => {
  const api = useApi();

  const verifyAdvertiserMutation = useMutation<
    Awaited<ReturnType<typeof api.verifyAdvertiser>>,
    AxiosError<unknown>,
    Parameters<typeof api.verifyAdvertiser>[0]
  >(api.verifyAdvertiser, {});

  return verifyAdvertiserMutation;
};
