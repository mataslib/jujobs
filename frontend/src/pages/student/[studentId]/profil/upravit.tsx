import { LoadingButton } from "@mui/lab";
import {
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Alerts, useAlerts } from "../../../../components/Alerts";
import {
  StudentForm,
  useStudentForm,
} from "../../../../components/StudentForm";
import { useGetStudent } from "../../../../hooks/useGetStudent";
import { useUpdateStudent } from "../../../../hooks/useUpdateStudent";

const UpravitProfil: NextPage = () => {
  const router = useRouter();
  // const { user } = useUser();
  const { studentId } = router.query;

  const getAlerts = useAlerts();
  const getStudent = useGetStudent({
    studentId: studentId as string | undefined,
    queryOptions: {
      onError: getAlerts.addErrorAlert,
    },
  });

  const updateAlerts = useAlerts();
  const updateStudentProfile = useUpdateStudent();

  const usedForm = useStudentForm();
  useEffect(() => {
    if (getStudent.queryResult.data) {
      usedForm.reset({
        linkedin: getStudent.queryResult.data.linkedin,
        cv: getStudent.queryResult.data.cv,
      });
    }
  }, [getStudent.queryResult.data]);

  if (getStudent.queryResult.error) {
    return (
      <Layout>
        <Alerts usedAlerts={getAlerts} />
      </Layout>
    );
  }

  if (!studentId || getStudent.queryResult.isLoading) {
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    );
  }

  return (
    <Layout>
      <Stack spacing={2}>
        <StudentForm
          id="studentForm"
          usedForm={usedForm}
          onSubmit={async (formData) => {
            updateStudentProfile.mutate(
              {
                ...formData,
                studentId: studentId as string,
              },
              {
                onError: updateAlerts.addErrorAlert,
                onSuccess: () => updateAlerts.addSuccessAlert(),
              }
            );
          }}
        />

        <Alerts usedAlerts={updateAlerts} />

        <LoadingButton
          form="studentForm"
          // loading={useForm.formState.isSubmitting}
          loading={usedForm.formState.isSubmitting}
          type="submit"
          variant="contained"
          color="primary"
        >
          Uložit
        </LoadingButton>
      </Stack>
    </Layout>
  );
};

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <Container sx={{ marginY: 2 }}>
      <Typography variant="h1">Profil studenta</Typography>
      <Paper sx={{ padding: 2 }}>{props.children}</Paper>
    </Container>
  );
};
export default UpravitProfil;
