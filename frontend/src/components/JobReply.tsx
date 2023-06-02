import { LoadingButton } from "@mui/lab";
import { Container, Paper, Typography } from "@mui/material";
import { IJobReadModel } from "shared/src/resource/job";
import { useReplyToJob } from "src/hooks/useReplyToJob";
import { useUser } from "src/hooks/useUser";
import { Alerts, useAlerts } from "./Alerts";
import { MyAlert } from "./MyAlert";
import { ReplyToJobForm, useReplyToJobForm } from "./ReplyToJobForm";
import { WithSkeleton } from "./WithSkeleton";

export const JobReply = (props: { job: IJobReadModel }) => {
  const { user } = useUser();
  const { job } = props;
  const shouldRender = user && user.roles.includes("student");
  const replyToJobForm = useReplyToJobForm();
  const replyToJob = useReplyToJob();
  const alerts = useAlerts();

  if (!shouldRender) {
    return null;
  }

  return (
    <Container sx={{ my: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Zájem o nabídku
        </Typography>

        {replyToJob.isSuccess ? (
          <MyAlert severity="success">
            Zájem o nabídku odeslán inzerentovi.
          </MyAlert>
        ) : (
          <>
            <ReplyToJobForm
              id="replyToJobForm"
              usedForm={replyToJobForm}
              onSubmit={async (formData) => {
                await replyToJob.mutateAsync(
                  { ...formData, jobId: job!._id },
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
        )}
      </Paper>
    </Container>
  );
};
