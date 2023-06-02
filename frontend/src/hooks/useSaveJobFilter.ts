import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useSaveJobFilter = () => {
  const api = useApi();

  const saveJobFilterMutation = useMutation<
    Awaited<ReturnType<typeof api.saveJobFilter>>,
    AxiosError<unknown>,
    Parameters<typeof api.saveJobFilter>[0]
  >({
    mutationFn: api.saveJobFilter,
  });

  return saveJobFilterMutation;
};
