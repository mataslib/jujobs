import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Alert, Container, Paper, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { ApiErrorAlert } from "../../components/ApiErrorAlert";
import MyTextField from "../../components/Form/MyTextField";
import { useResetForgottenPassword } from "../../hooks/useResetForgottenPassword";
import { onInvalid } from "../../util/onInvalid";

const validationSchema = createValidationSchema();
type FormFields = z.infer<typeof validationSchema>;

const ZapomenuteHesloZmena: NextPage = () => {
  const usedForm = useForm<FormFields>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });
  const { handleSubmit } = usedForm;

  const router = useRouter();
  const token = router.query.token as string;
  const resetForgottenPassword = useResetForgottenPassword();

  if (resetForgottenPassword.isSuccess) {
    return (
      <Layout>
        <Alert severity="success">
          Heslo změněno. Nyní se můžete přihlásit novým heslem.
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <FormProvider {...usedForm}>
        <form
          onSubmit={handleSubmit(async (formData) => {
            await resetForgottenPassword.mutateAsync({
              token: token,
              password: formData.password,
            });
          }, onInvalid(usedForm))}
          noValidate
        >
          <Stack spacing={2}>
            <MyTextField
              name="password"
              type="password"
              label="Heslo"
              required
            />
            <MyTextField
              name="passwordRepeat"
              type="password"
              label="Heslo znovu"
              required
            />
            <ApiErrorAlert error={resetForgottenPassword.error} />
            <LoadingButton
              loading={usedForm.formState.isSubmitting}
              type="submit"
              variant="contained"
              color="primary"
            >
              Změnit heslo
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
      <Typography variant="h1">Nové heslo</Typography>
      <Paper sx={{ padding: 2 }}>{props.children}</Paper>
    </Container>
  );
};

type ChildrenProps = {
  children: ReactNode;
};

function createValidationSchema() {
  const passwordSchema = z
    .string()
    .min(1, `required`)
    .min(8, `Alespoň 8 znaků`);

  const schema = z
    .object({
      password: passwordSchema,
      passwordRepeat: passwordSchema,
    })
    .refine((data) => data.password === data.passwordRepeat, {
      message: "Hesla se neshodují",
      path: ["passwordRepeat"],
    });

  return schema;
}

export default ZapomenuteHesloZmena;
