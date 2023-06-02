import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useSubscribeToNewJobNotification = () => {
  const api = useApi();

  const subscribeToNewJobNotificationMutation = useMutation<
    Awaited<ReturnType<typeof api.subscribeToNewJobNotification>>,
    AxiosError<unknown>,
    Parameters<typeof api.subscribeToNewJobNotification>[0]
  >({
    mutationFn: api.subscribeToNewJobNotification,
  });

  return subscribeToNewJobNotificationMutation;
};
