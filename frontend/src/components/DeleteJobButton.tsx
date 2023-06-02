import { LoadingButton } from "@mui/lab";
import { useQueryClient } from "@tanstack/react-query";
import { IJobReadModel } from "shared/src/resource/job";
import { useMySnackbar } from "src/hooks/useMySnackbar";
import { useDeleteJob } from "../hooks/useDeleteJob";
import { withConfirm } from "../util/utils";

export const DeleteJobButton = (props: { job: IJobReadModel }) => {
  const { job } = props;
  const queryClient = useQueryClient();
  const deleteJob = useDeleteJob();
  const mySnackbar = useMySnackbar();

  return (
    <LoadingButton
      loading={deleteJob.isLoading}
      variant="contained"
      onClick={withConfirm(
        () =>
          deleteJob.mutate(
            { jobId: job._id },
            {
              onSuccess: () => {
                queryClient.invalidateQueries(["getJobView", job._id]);
              },
              onError: (err) => {
                mySnackbar.enqueueSnackbar({
                  apiErr: err,
                });
              },
            }
          ),
        "Opravdu chcete smazat nabídku?"
      )}
    >
      Smazat
    </LoadingButton>
  );
};
