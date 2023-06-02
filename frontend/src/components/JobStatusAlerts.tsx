import { Container, Stack } from "@mui/material";
import { IJobReadModel } from "shared/src/resource/job";
import { MyAlert } from "./MyAlert";

export const JobStatusAlerts = (props: { job: IJobReadModel }) => {
  const { job } = props;
  const shouldRender = !job?.approved || job?.archived;

  if (!shouldRender) {
    return null;
  }

  return (
    <Container sx={{ my: 2 }}>
      <Stack sx={{ my: 2 }} spacing={1}>
        {job?.approved === false && (
          <MyAlert severity="warning">Nabídka není schválená.</MyAlert>
        )}
        {job?.archived === true && (
          <MyAlert severity="warning">Nabídka je archivovaná.</MyAlert>
        )}
      </Stack>
    </Container>
  );
};
