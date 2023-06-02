import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ApiErrorAlert } from "../components/ApiErrorAlert";
import MyTextField from "../components/Form/MyTextField";
import { Link } from "../components/Link/Link";
import { useUser } from "../hooks/useUser";
import { onInvalid } from "../util/onInvalid";

const validationSchema = createValidationSchema();
type FormFields = z.infer<typeof validationSchema>;

const Prihlaseni: NextPage = () => {
  const usedForm = useForm<FormFields>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });
  const { handleSubmit } = usedForm;

  // const router = useRouter();
  const { user, useLogin } = useUser();

  const usedLogin = useLogin();

  // const { isLoading, error, login } = {};
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    usedLogin.mutate(data);
  };

  if (user) {
    return (
      <Container sx={{ marginY: 2 }}>
        <Paper>
          <Alert severity="success">
            <AlertTitle>Jste přihlášeni</AlertTitle>
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ marginY: 2 }}>
      <Typography variant="h1">Přihlášení</Typography>
      <Paper sx={{ padding: 2 }}>
        <FormProvider {...usedForm}>
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid(usedForm))}
            noValidate
          >
            <Stack spacing={2}>
              <MyTextField name="email" label="Email" required type="email" />
              <MyTextField
                name="password"
                label="Heslo"
                required
                type="password"
              />

              <ApiErrorAlert error={usedLogin.error} />

              <LoadingButton
                loading={usedLogin.isLoading}
                type="submit"
                variant="contained"
                color="primary"
              >
                Přihlásit
              </LoadingButton>

              <Link href={"/zapomenute-heslo"}>Zapomenuté heslo</Link>
            </Stack>
          </form>
        </FormProvider>
      </Paper>
    </Container>
  );
};

function createValidationSchema() {
  const schema = z.object({
    email: z.string().email().min(1, "required"),
    password: z.string().min(1, "required"),
  });

  return schema;
}

export default Prihlaseni;
