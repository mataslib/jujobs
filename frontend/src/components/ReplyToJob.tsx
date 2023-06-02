import { LoadingButton } from "@mui/lab";
import { Paper, Typography } from "@mui/material";
import { ReactNode } from "react";
import { IJobReadModel } from "shared/src/resource/job";
import { useReplyToJob } from "src/hooks/useReplyToJob";
import { Alerts, useAlerts } from "./Alerts";
import { MyAlert } from "./MyAlert";
import { ReplyToJobForm, useReplyToJobForm } from "./ReplyToJobForm";
import { WithSkeleton } from "./WithSkeleton";

export const ReplyToJob = (props: { job?: IJobReadModel }) => {
  const replyToJobForm = useReplyToJobForm();
  const replyToJob = useReplyToJob();
  const alerts = useAlerts();

  if (replyToJob.isSuccess) {
    return (
      <>
        <MyAlert severity="success">
          Zájem o nabídku odeslán inzerentovi.
        </MyAlert>
      </>
    );
  }

  return (
    <>
      <ReplyToJobForm
        id="replyToJobForm"
        usedForm={replyToJobForm}
        onSubmit={async (formData) => {
          await replyToJob.mutateAsync(
            { ...formData, jobId: props.job!._id },
            {
              onError: alerts.addErrorAlert,
            }
          );
        }}
      />

      <Alerts usedAlerts={alerts} />

      <WithSkeleton showSkeleton={!props.job}>
        <LoadingButton
          sx={{ my: 2 }}
          form="replyToJobForm"
          type="submit"
          variant="contained"
          loading={replyToJob.isLoading}
          disabled={replyToJob.isSuccess}
        >
          Mám zájem
        </LoadingButton>
      </WithSkeleton>
    </>
  );
};


