import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApi } from "./useApi";

export const useImportStagStudy = () => {
  const api = useApi();

  const importStagStudyMutation = useMutation<
    Awaited<ReturnType<typeof api.importStagStudy>>,
    AxiosError<unknown>,
    Parameters<typeof api.importStagStudy>[0]
  >({
    mutationFn: api.importStagStudy,
  });

  return importStagStudyMutation;
};
