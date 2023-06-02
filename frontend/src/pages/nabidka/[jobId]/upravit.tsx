import { LoadingButton } from "@mui/lab";
import {
  CircularProgress,
  Container,
  FormHelperText,
  Paper,
} from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { dateValueToDateInputValue } from "src/components/Form/MyDateField";
import {
  CreateUpdateJobForm,
  useCreateUpdateJobForm,
} from "src/components/JobForm/CreateUpdateJobForm";
import { Alerts, useAlerts } from "../../../components/Alerts";
import { useGetJobView } from "../../../hooks/useGetJobView";
import { useUpdateJob } from "../../../hooks/useUpdateJob";

const Upravit: NextPage = (props) => {
  const router = useRouter();
  const jobId = router.query.jobId as string;

  const getJobView = useGetJobView({
    jobId: jobId,
  });
  const usedForm = useCreateUpdateJobForm();
  const alerts = useAlerts();
  const updateJob = useUpdateJob();

  useEffect(() => {
    if (getJobView.queryResult.data) {
      usedForm.reset({
        title: getJobView.queryResult.data.title,
        scope: getJobView.queryResult.data.scope,
        text: getJobView.queryResult.data.text,
        requirements: getJobView.queryResult.data.requirements,
        benefits: getJobView.queryResult.data.benefits,
        salary: getJobView.queryResult.data.salary,
        place: getJobView.queryResult.data.place,
        startDate: getJobView.queryResult.data.startDate,
        deadlineAt: dateValueToDateInputValue(
          getJobView.queryResult.data.deadlineAt
        ),
        specificPlace: getJobView.queryResult.data.specificPlace,
        other: getJobView.queryResult.data.other,
        legalType: getJobView.queryResult.data.legalType,
        durationType: getJobView.queryResult.data.durationType,
        employmentType: getJobView.queryResult.data.employmentType,
        facultyTypes: getJobView.queryResult.data.facultyTypes,
        fieldTypes: getJobView.queryResult.data.fieldTypes,
        homeoffice: getJobView.queryResult.data.homeoffice,
        replyToEmail: getJobView.queryResult.data.replyToEmail,
      });
    }
  }, [getJobView.queryResult.data]);

  if (getJobView.queryResult.isError) {
    return (
      <Layout>
        <Alerts usedAlerts={alerts} />
      </Layout>
    );
  }

  if (!getJobView.queryResult.data) {
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    );
  }

  return (
    <Layout>
      <CreateUpdateJobForm
        id="updateJobForm"
        onSubmit={async (formData) => {
          updateJob.mutate(
            {
              ...formData,
              deadlineAt: formData.deadlineAt.toString(),
              jobId: jobId,
            },
            {
              onSuccess: () => {
                router.push(`/nabidka/${jobId}/upraveno`);
              },
              onError: alerts.addErrorAlert,
            }
          );
        }}
        usedForm={usedForm}
      />

      <FormHelperText>
        Z důvodu optimalizace se nová nabídka propíše do seznamu nabídek
        nejdříve za 60s po schválení.
      </FormHelperText>

      <Alerts usedAlerts={alerts} />

      <LoadingButton
        form="updateJobForm"
        loading={usedForm.formState.isSubmitting}
        type="submit"
        variant="contained"
        color="primary"
      >
        Odeslat ke schválení administrátorům
      </LoadingButton>
    </Layout>
  );
};

const Layout = (props: { children: ReactNode }) => {
  return (
    <Container sx={{ marginY: 2 }}>
      <Paper sx={{ padding: 2 }}>{props.children}</Paper>
    </Container>
  );
};

export default Upravit;
