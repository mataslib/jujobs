import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useRequestEmailChange = () => {
  const api = useApi();

  const requestEmailChangeMutation = useMutation<
    Awaited<ReturnType<typeof api.requestEmailChange>>,
    AxiosError<unknown>,
    Parameters<typeof api.requestEmailChange>[0]
  >({
    mutationFn: api.requestEmailChange,
  });

  return requestEmailChangeMutation;
};
