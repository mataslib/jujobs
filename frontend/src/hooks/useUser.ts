import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAppContext } from "../components/AppContext";
import { useApi } from "./useApi";

export const useUser = () => {
  const appContext = useAppContext();

  const api = useApi();

  const useLogin = () => {
    const authenticateMutation = useMutation<
      Awaited<ReturnType<typeof api.authenticate>>,
      AxiosError<unknown>,
      Parameters<typeof api.authenticate>[0]
    >(api.authenticate, {
      onSettled: (token, error, variables, context) => {
        appContext.setUpUserContext(token);
      },
    });

    return authenticateMutation;
  };

  return {
    user: appContext.user,
    useLogin: useLogin,
    logout: () => {
      localStorage.removeItem("token");
      appContext.setUpUserContext(undefined);
    },
  };
};
