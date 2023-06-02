import { OptionsObject, useSnackbar } from "notistack";
import { parseApiError } from "src/util/apiError";

export const useMySnackbar = () => {
  const snackbar = useSnackbar();

  return {
    enqueueSnackbar: (
      options: OptionsObject & {
        apiErr: any;
      }
    ) => {
      if (options.apiErr) {
        const parsed = parseApiError(options.apiErr);
        snackbar.enqueueSnackbar({
          message: parsed.message,
          variant: "error",
        });
      }
    },
  };
};
