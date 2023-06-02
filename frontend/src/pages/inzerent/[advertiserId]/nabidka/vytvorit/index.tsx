import { LoadingButton } from "@mui/lab";
import { Container, FormHelperText, Paper } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Alerts, useAlerts } from "../../../../../components/Alerts";
import {
  CreateUpdateJobForm,
  useCreateUpdateJobForm,
} from "../../../../../components/JobForm/CreateUpdateJobForm";
import { useCreateJob } from "../../../../../hooks/useCreateJob";
import { useUser } from "../../../../../hooks/useUser";

const Vytvorit: NextPage = () => {
  const router = useRouter();
  const createAlerts = useAlerts();
  const createJob = useCreateJob();
  const usedForm = useCreateUpdateJobForm();
  const { advertiserId } = router.query;
  const { user } = useUser();

  // Prefill replyToEmail field form user token
  useEffect(() => {
    if (user) {
      usedForm.reset({
        replyToEmail: user?.email,
      });
    }
  }, [user]);

  return (
    <div>
      <Container sx={{ marginY: 2 }}>
        <Paper sx={{ padding: 2 }}>
          <CreateUpdateJobForm
            id="createJobForm"
            onSubmit={async (formData) => {
              debugger;
              createJob.mutate(
                {
                  ...formData,
                  deadlineAt: formData.deadlineAt.toString(),
                  advertiserId: advertiserId as string,
                },
                {
                  onSuccess: (data) => {
                    router.push(`/nabidka/${data.jobId}/vytvoreno`);
                  },
                  onError: createAlerts.addErrorAlert,
                }
              );
            }}
            usedForm={usedForm}
          />

          <FormHelperText>
            Z důvodu optimalizace se nová nabídka propíše do seznamu nabídek
            nejdříve za 60s po schválení.
          </FormHelperText>

          <Alerts usedAlerts={createAlerts} />

          <LoadingButton
            loading={usedForm.formState.isSubmitting}
            type="submit"
            variant="contained"
            color="primary"
            form="createJobForm"
          >
            Odeslat ke schválení administrátorům
          </LoadingButton>
        </Paper>
      </Container>
    </div>
  );
};

export default Vytvorit;
