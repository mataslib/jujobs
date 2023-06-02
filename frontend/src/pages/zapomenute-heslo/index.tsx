import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Alert, Container, Paper, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import { ReactNode } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ApiErrorAlert } from "../../components/ApiErrorAlert";
import MyTextField from "../../components/Form/MyTextField";
import { useRequestForgottenPassword } from "../../hooks/useRequestForgottenPassword";
import { onInvalid } from "../../util/onInvalid";

const validationSchema = createValidationSchema();
type FormFields = z.infer<typeof validationSchema>;

const ZapomenuteHeslo: NextPage = () => {
  const usedForm = useForm<FormFields>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });
  const { handleSubmit } = usedForm;

  // const router = useRouter();
  const requestForgottenPassword = useRequestForgottenPassword();

  // const { isLoading, error, login } = {};
  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    requestForgottenPassword.mutate({
      ...formData,
      changePasswordUrl: `${window.location.origin}/zapomenute-heslo`,
    });
  };

  if (requestForgottenPassword.isSuccess) {
    return (
      <Layout>
        <Alert severity="success">
          Zkontrolujte svůj email a postupujte dle instrukcí.
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <FormProvider {...usedForm}>
        <form onSubmit={handleSubmit(onSubmit, onInvalid(usedForm))} noValidate>
          <Stack spacing={2}>
            <MyTextField name="email" label="Email" required type="email" />
            <ApiErrorAlert error={requestForgottenPassword.error} />
            <LoadingButton
              loading={usedForm.formState.isSubmitting}
              type="submit"
              variant="contained"
              color="primary"
            >
              Obnovit heslo
            </LoadingButton>
          </Stack>
        </form>
      </FormProvider>
    </Layout>
  );
};

// PaperWithTit
const Layout = (props: ChildrenProps) => {
  return (
    <Container sx={{ marginY: 2 }}>
      <Typography variant="h1">Zapomenuté heslo</Typography>
      <Paper sx={{ padding: 2 }}>{props.children}</Paper>
    </Container>
  );
};

type ChildrenProps = {
  children: ReactNode;
};

function createValidationSchema() {
  const schema = z.object({
    email: z.string().email().min(1, "required"),
  });

  return schema;
}

export default ZapomenuteHeslo;
