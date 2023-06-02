import { LoadingButton } from "@mui/lab";
import { useQueryClient } from "@tanstack/react-query";
import { IJobReadModel } from "shared/src/resource/job";
import { useMySnackbar } from "src/hooks/useMySnackbar";
import { useArchiveJob } from "../hooks/useArchiveJob";
import { withConfirm } from "../util/utils";

export const ArchiveJobButton = (props: { job: IJobReadModel }) => {
  const { job } = props;
  const archiveJob = useArchiveJob();
  const mySnackbar = useMySnackbar();
  const queryClient = useQueryClient();

  return (
    <LoadingButton
      loading={archiveJob.isLoading}
      variant="contained"
      onClick={withConfirm(
        () =>
          archiveJob.mutate(
            { jobId: job._id },
            {
              onSuccess: () => {
                queryClient.invalidateQueries(["getJobView", job._id]);
              },
              onError: (err) => {
                mySnackbar.enqueueSnackbar({ apiErr: err });
              },
            }
          ),
        "Opravdu chcete archivovat nabídku?"
      )}
    >
      Archivovat
    </LoadingButton>
  );
};
