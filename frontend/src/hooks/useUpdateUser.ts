import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useUpdateUser = () => {
  const api = useApi();

  const updateUserMutation = useMutation<
    Awaited<ReturnType<typeof api.updateUser>>,
    AxiosError<unknown>,
    Parameters<typeof api.updateUser>[0]
  >({
    mutationFn: api.updateUser,
  });

  return updateUserMutation;
};
