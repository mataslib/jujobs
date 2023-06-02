import { LoadingButton } from "@mui/lab";
import { useQueryClient } from "@tanstack/react-query";
import { IJobReadModel } from "shared/src/resource/job";
import { useMySnackbar } from "src/hooks/useMySnackbar";
import { useApproveJob } from "../hooks/useApproveJob";
import { withConfirm } from "../util/utils";

export const ApproveJobButton = (props: { job: IJobReadModel }) => {
  const { job } = props;
  const queryClient = useQueryClient();
  const approveJob = useApproveJob();
  const mySnackbar = useMySnackbar();

  return (
    <LoadingButton
      loading={approveJob.isLoading}
      variant="contained"
      onClick={withConfirm(
        () =>
          approveJob.mutate(
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
        "Opravdu chcete schválit nabídku?"
      )}
    >
      Schválit
    </LoadingButton>
  );
};
