import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useUnsubscribeFromNewJobNotification = () => {
  const api = useApi();

  const unsubscribeFromNewJobNotificationMutation = useMutation<
    Awaited<ReturnType<typeof api.unsubscribeFromNewJobNotification>>,
    AxiosError<unknown>,
    Parameters<typeof api.unsubscribeFromNewJobNotification>[0]
  >({
    mutationFn: api.unsubscribeFromNewJobNotification,
  });

  return unsubscribeFromNewJobNotificationMutation;
};
