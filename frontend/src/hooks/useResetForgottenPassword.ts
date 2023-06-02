import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useResetForgottenPassword = () => {
  const api = useApi();

  const resetForgottenPasswordMutation = useMutation<
    Awaited<ReturnType<typeof api.resetForgottenPassword>>,
    AxiosError<unknown>,
    Parameters<typeof api.resetForgottenPassword>[0]
  >({
    mutationFn: api.resetForgottenPassword,
  });

  return resetForgottenPasswordMutation;
};
