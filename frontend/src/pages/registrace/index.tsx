import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Container, Paper, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { ApiErrorAlert } from "../../components/ApiErrorAlert";
import MyTextField from "../../components/Form/MyTextField";
import { useRegisterAdvertiser } from "../../hooks/useRegisterAdvertiser";
import { onInvalid } from "../../util/onInvalid";

const validationSchema = createValidationSchema();

type FormFields = z.infer<typeof validationSchema>;

const Registrace: NextPage = () => {
  const usedForm = useForm<FormFields>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  const router = useRouter();
  const registerAdvertiser = useRegisterAdvertiser();

  return (
    <div>
      <Container sx={{ marginY: 2 }}>
        <Typography variant="h1">Registrace inzerenta</Typography>
        <Paper sx={{ padding: 2 }}>
          <FormProvider {...usedForm}>
            <form
              onSubmit={usedForm.handleSubmit(async (formData) => {
                await registerAdvertiser.mutateAsync({
                  name: formData.name,
                  email: formData.email,
                  password: formData.password,
                  verifyUrl: `${window.location.origin}/registrace/overeni`,
                });
                await router.push(router.pathname + "/uspech");
              }, onInvalid(usedForm))}
              noValidate
            >
              <Stack spacing={2}>
                <MyTextField name="name" label="Název" required />
                <MyTextField name="email" type="email" label="Email" required />
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

                <ApiErrorAlert error={registerAdvertiser.error} />

                <LoadingButton
                  loading={registerAdvertiser.isLoading}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Registrovat
                </LoadingButton>
              </Stack>
            </form>
          </FormProvider>
        </Paper>
      </Container>
    </div>
  );
};

function createValidationSchema() {
  let schema = z
    .object({
      name: z.string().min(1, `povinné`),
      email: z.string().min(1, `required`).email(),
      password: z.string().min(8, `Alespoň 8 znaků`),
      passwordRepeat: z.string(),
    })
    .refine((data) => data.password === data.passwordRepeat, {
      message: "Hesla se neshodují",
      path: ["passwordRepeat"],
    });

  return schema;
}

export default Registrace;
