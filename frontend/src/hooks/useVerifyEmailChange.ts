import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useVerifyEmailChange = () => {
  const api = useApi();

  const verifyEmailChangeMutation = useMutation<
    Awaited<ReturnType<typeof api.verifyEmailChange>>,
    AxiosError<unknown>,
    Parameters<typeof api.verifyEmailChange>[0]
  >(api.verifyEmailChange, {});

  return verifyEmailChangeMutation;
};
