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
import { Alerts, useAlerts } from "src/components/Alerts";
import {
  AdvertiserProfileForm,
  AdvertiserProfileFormFields,
  useAdvertiserProfileForm,
} from "../../../components/AdvertiserProfileForm";
import { useGetAdvertiserView } from "../../../hooks/useGetAdvertiserView";
import { useUpdateAdvertiserProfile } from "../../../hooks/useUpdateAdvertiserProfile";

const Profil: NextPage = () => {
  const router = useRouter();
  // const { user } = useUser();
  const { advertiserId } = router.query;
  const alerts = useAlerts();
  const getAdvertiserView = useGetAdvertiserView({
    advertiserId: advertiserId as string | undefined,
  });

  const updateAdvertiserProfile = useUpdateAdvertiserProfile();

  const usedForm = useAdvertiserProfileForm();
  useEffect(() => {
    if (getAdvertiserView.queryResult.data) {
      usedForm.reset({
        about: getAdvertiserView.queryResult.data.about,
        logo: getAdvertiserView.queryResult.data.logo,
        name: getAdvertiserView.queryResult.data.name,
        web: getAdvertiserView.queryResult.data.web,
      });
    }
  }, [getAdvertiserView.queryResult.data]);

  if (getAdvertiserView.queryResult.error) {
    return (
      <Layout>
        <Alerts usedAlerts={alerts} />
      </Layout>
    );
  }

  if (!advertiserId || getAdvertiserView.queryResult.isLoading) {
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    );
  }

  return (
    <Layout>
      <Stack spacing={2}>
        <AdvertiserProfileForm
          id="advertiserProfileForm"
          usedForm={usedForm}
          onSubmit={async (formData) => {
            const requestPayload = await createPayload({
              formData,
              advertiserId: advertiserId,
            });

            updateAdvertiserProfile.mutate(requestPayload, {
              onError: alerts.addErrorAlert,
              onSuccess: () => alerts.addSuccessAlert(),
            });
          }}
        />

        <Alerts usedAlerts={alerts} />

        <LoadingButton
          form="advertiserProfileForm"
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

async function createPayload(data: {
  formData: AdvertiserProfileFormFields;
  advertiserId: string;
}) {
  const { formData, advertiserId } = data;

  const resolveLogoValue = async (
    logoValue: AdvertiserProfileFormFields["logo"]
  ) => {
    if (typeof logoValue === "string") {
      // current url
      return undefined;
    } else if (logoValue === false) {
      // deleted current
      return null;
    } else if (logoValue) {
      // new
      const logoB64 = await fileToBase64(logoValue);
      return logoB64;
    }
  };

  return {
    ...formData,
    advertiserId,
    logo: await resolveLogoValue(formData.logo),
  };
}

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <Container sx={{ marginY: 2 }}>
      <Typography variant="h1">Profil inzerenta</Typography>
      <Paper sx={{ padding: 2 }}>{props.children}</Paper>
    </Container>
  );
};

async function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
    setTimeout(() => {
      reject(new Error("Image to Base64 timeout!"));
    }, 10000);
  });
}

export default Profil;
