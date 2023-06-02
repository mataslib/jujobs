import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ChangeUserEmailForm,
  useChangeUserEmailForm,
} from "../../../components/ChangeUserEmailForm";
import {
  ChangeUserPasswordForm,
  useChangeUserPasswordForm,
} from "../../../components/ChangeUserPasswordForm";
import { ApiErrorAlert } from "../../../components/ApiErrorAlert";
import { MyAlert } from "../../../components/MyAlert";
import { useUserDataForm } from "../../../components/UserDataForm";
import { useRequestEmailChange } from "../../../hooks/useRequestEmailChange";
import { useUpdateUser } from "../../../hooks/useUpdateUser";
import { useUser } from "../../../hooks/useUser";
import { Alerts, useAlerts } from "../../../components/Alerts";

const Profil: NextPage = () => {
  const router = useRouter();
  // const { user } = useUser();
  const { userId } = router.query;

  // vs show data from token

  const { user } = useUser();

  const changePasswordAlerts = useAlerts();
  const updateUser = useUpdateUser();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const changeUserPasswordForm = useChangeUserPasswordForm();

  const emailChangeAlerts = useAlerts();
  const requestEmailChange = useRequestEmailChange();
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const changeUserEmailForm = useChangeUserEmailForm();

  return (
    <Container sx={{ my: 2 }}>
      <Typography variant="h1">Nastavení uživatele</Typography>

      <Box sx={{ my: 2 }}>
        <Typography variant="h3">Email</Typography>
        <Paper sx={{ padding: 2 }}>
          {!user ? (
            <CircularProgress />
          ) : (
            <>
              <Typography display="inline" component="span">
                {user.email}
              </Typography>
              {!showChangeEmail && (
                <>
                  <Button onClick={() => setShowChangeEmail(true)}>
                    Změnit
                  </Button>

                  <Alerts usedAlerts={emailChangeAlerts} />
                </>
              )}
              {showChangeEmail && (
                <Box sx={{ mt: 2 }}>
                  <ChangeUserEmailForm
                    id={"changeUserEmail"}
                    usedForm={changeUserEmailForm}
                    onSubmit={async (formData) => {
                      await requestEmailChange.mutate(
                        {
                          newEmail: formData.newEmail,
                          verifyEmailUrl: `${window.location.origin}/uzivatel/overeni-email`,
                          userId: user.userId,
                        },
                        {
                          onSuccess: () => {
                            setShowChangeEmail(false);
                            emailChangeAlerts.addSuccessAlert(
                              `Dokončete změnu navštívením odkazu, který jsme zaslali na váš nový email.`
                            );
                          },
                          onError: emailChangeAlerts.addErrorAlert,
                        }
                      );
                    }}
                  />
                  <Box sx={{ mt: 1 }}>
                    <Alerts usedAlerts={emailChangeAlerts} />
                  </Box>
                  <LoadingButton
                    sx={{ mt: 1 }}
                    variant="contained"
                    loading={requestEmailChange.isLoading}
                    type="submit"
                    form="changeUserEmail"
                  >
                    Změnit
                  </LoadingButton>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>

      <Box sx={{ my: 2 }}>
        <Typography variant="h3">Heslo</Typography>
        <Paper sx={{ padding: 2 }}>
          {!user ? (
            <CircularProgress />
          ) : (
            <>
              <Typography display="inline" component="span">
                ********
              </Typography>
              {!showChangePassword && (
                <>
                  <Button onClick={() => setShowChangePassword(true)}>
                    Změnit
                  </Button>

                  <Alerts usedAlerts={changePasswordAlerts} />
                </>
              )}
              {showChangePassword && (
                <Box sx={{ mt: 2 }}>
                  <ChangeUserPasswordForm
                    id="changeUserPassword"
                    usedForm={changeUserPasswordForm}
                    onSubmit={async (formData) => {
                      updateUser.mutate(
                        {
                          password: formData.password,
                          userId: user.userId,
                        },
                        {
                          onSuccess: () => {
                            setShowChangePassword(false);
                            changePasswordAlerts.addSuccessAlert();
                          },
                          onError: changePasswordAlerts.addErrorAlert,
                        }
                      );
                    }}
                  />
                  <Box sx={{ mt: 1 }}>
                    <Alerts usedAlerts={changePasswordAlerts} />
                  </Box>
                  <LoadingButton
                    sx={{ mt: 1 }}
                    variant="contained"
                    loading={updateUser.isLoading}
                    type="submit"
                    form="changeUserPassword"
                  >
                    Změnit
                  </LoadingButton>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Profil;
