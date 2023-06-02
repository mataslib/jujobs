import { LoadingButton } from "@mui/lab";
import { CircularProgress, Container, Paper, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IStudentReadModel } from "shared/src/resource/student";
import { Alerts, useAlerts } from "../../../../../components/Alerts";
import { MyAlert } from "../../../../../components/MyAlert";
import { StudyForm, useStudyForm } from "../../../../../components/StudyForm";
import { useGetStudent } from "../../../../../hooks/useGetStudent";
import { useUpdateStudy } from "../../../../../hooks/useUpdateStudy";
import { useUser } from "../../../../../hooks/useUser";

const UpravitStudium: NextPage = () => {
  const router = useRouter();
  const updateAlerts = useAlerts();
  const updateStudy = useUpdateStudy();
  const usedForm = useStudyForm();
  const { user } = useUser();

  const studyId = router.query.studyId;
  const studentId = router.query.studentId;

  const getAlerts = useAlerts();
  const getStudent = useGetStudent({
    studentId: studentId as string | undefined,
    queryOptions: {
      onError: getAlerts.addErrorAlert,
    },
  });

  const [study, setStudy] = useState<IStudentReadModel["studies"]>();

  useEffect(() => {
    if (getStudent.queryResult.data) {
      const study = {
        ...getStudent.queryResult.data.studies.find(
          (study) => study._id === studyId
        ),
      };
      usedForm.reset(study);
      setStudy(study);
    }
  }, [getStudent.queryResult.data]);

  if (getStudent.queryResult.error) {
    return (
      <Layout>
        <Alerts usedAlerts={getAlerts} />
      </Layout>
    );
  }

  if (study) {
    return (
      <Layout>
        <StudyForm
          id="StudyForm"
          onSubmit={async (formData) => {
            await updateStudy.mutate(
              {
                ...formData,
                studyId: studyId as string,
              },
              {
                onError: updateAlerts.addErrorAlert,
                onSuccess: () => {
                  updateAlerts.addSuccessAlert();
                },
              }
            );
          }}
          usedForm={usedForm}
        />

        {study.dataSource === "stag" && (
          <MyAlert severity="warning" sx={{ my: 2 }}>
            Po uložení bude záznam označen jako upravený studentem.
          </MyAlert>
        )}

        <Alerts usedAlerts={updateAlerts} />

        <LoadingButton
          type="submit"
          form="StudyForm"
          variant="contained"
          loading={updateStudy.isLoading}
        >
          Uložit
        </LoadingButton>
      </Layout>
    );
  }

  return (
    <Layout>
      <CircularProgress />
    </Layout>
  );
};

const Layout = (props) => {
  return (
    <Container sx={{ marginY: 2 }}>
      <Typography variant="h2">Upravit studium</Typography>
      <Paper sx={{ padding: 2 }}>{props.children}</Paper>
    </Container>
  );
};

export default UpravitStudium;
