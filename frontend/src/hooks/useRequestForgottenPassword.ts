import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useRequestForgottenPassword = () => {
  const api = useApi();

  const requestForgottenPasswordMutation = useMutation<
    Awaited<ReturnType<typeof api.requestForgottenPassword>>,
    AxiosError<unknown>,
    Parameters<typeof api.requestForgottenPassword>[0]
  >({
    mutationFn: api.requestForgottenPassword,
  });

  return requestForgottenPasswordMutation;
};
