import { LoadingButton } from "@mui/lab";
import { Container, Paper, Typography } from "@mui/material";
import type { NextPage } from "next";
import { Alerts, useAlerts } from "../../components/Alerts";
import { StudyForm, useStudyForm } from "../../components/StudyForm";
import { useCreateStudy } from "../../hooks/useCreateStudy";
import { useUser } from "../../hooks/useUser";

const VytvoritStudium: NextPage = () => {
  const createAlerts = useAlerts();
  const createStudy = useCreateStudy();
  const usedForm = useStudyForm();
  const { user } = useUser();

  if (!user) {
    debugger;
  }

  return (
    <div>
      <Container sx={{ marginY: 2 }}>
        <Typography variant="h2">Vytvořit studium</Typography>
        <Paper sx={{ padding: 2 }}>
          <StudyForm
            id="StudyForm"
            onSubmit={async (formData) => {
              createStudy.mutate(
                {
                  ...formData,
                  studentId: user.studentId,
                },
                {
                  onError: createAlerts.addErrorAlert,
                  onSuccess: () => {
                    createAlerts.addSuccessAlert();
                  },
                }
              );
            }}
            usedForm={usedForm}
          />

          <Alerts usedAlerts={createAlerts} />

          <LoadingButton
            type="submit"
            form="StudyForm"
            variant="contained"
            loading={createStudy.isLoading}
          >
            Vytvořit
          </LoadingButton>
        </Paper>
      </Container>
    </div>
  );
};

export default VytvoritStudium;
