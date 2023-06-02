import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGetUser } from "src/hooks/useGetUser";
import { Alerts, useAlerts } from "../../components/Alerts";
import JobsFilterForm, {
  useJobsFilterForm,
} from "../../components/Jobs/JobsFilterForm";
import { useUnsubscribeFromNewJobNotification } from "../../hooks/useDeleteNewJobNotificationConfig";
import { useSubscribeToNewJobNotification } from "../../hooks/useSaveNewJobNotificationConfig";
import { useUser } from "../../hooks/useUser";
import { parsedQuerystring } from "../../util/utils";

const Notifikace: NextPage = () => {
  const router = useRouter();

  return (
    <Container sx={{ my: 2 }}>
      <Typography sx={{ my: 2 }} variant="h1">
        Notifikace
      </Typography>

      <Description />

      <Box sx={{ my: 3 }}>
        <Typography variant="h2">Konfigurace notifikací</Typography>
        <Status />
        <CreateUpdateNotificationsView />
      </Box>
    </Container>
  );
};

const Status = () => {
  const { user } = useUser();
  const getUser = useGetUser({
    userId: user?.userId,
  });

  if (getUser.queryResult.error || getUser.queryResult.isLoading) {
    return null;
  }

  return (
    <Box sx={{ my: 1 }}>
      {getUser.queryResult?.data.newJobNotificationSubscription ? (
        <Alert severity="success">Notifikace jsou aktivní</Alert>
      ) : (
        <Alert severity="warning">Notifikace jsou vypnuté</Alert>
      )}
    </Box>
  );
};

const Description = () => (
  <Paper sx={{ padding: 2 }}>
    <List>
      <ListItem>
        <ListItemText primary="Zde si můžete nastavit emailové notifikace na nové nabídky." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Notifikace jsou odesílány 1x týdně." />
      </ListItem>
    </List>
  </Paper>
);

const CreateUpdateNotificationsView = () => {
  const queryClient = useQueryClient();

  const saveDeleteAlerts = useAlerts();
  const getAlerts = useAlerts();

  const jobsFilterForm = useJobsFilterForm();
  const { user } = useUser();
  const router = useRouter();

  const subscribeToNewJobNotification = useSubscribeToNewJobNotification();
  const unsubscribeFromNewJobNotification =
    useUnsubscribeFromNewJobNotification();
  const getUser = useGetUser({
    userId: user?.userId,
    queryOptions: {
      onError: (err) => getAlerts.addErrorAlert(err),
    },
  });

  useEffect(() => {
    if (getUser.queryResult.isFetched && router.isReady) {
      const parsedQuery = parsedQuerystring();
      if (parsedQuery?.filter) {
        jobsFilterForm.reset(parsedQuery);
      } else {
        jobsFilterForm.reset(
          getUser.queryResult.data?.newJobNotificationSubscription?.filter
        );
      }
    }
  }, [getUser.queryResult.data, router.query]);

  if (getUser.queryResult.isFetching) {
    return <CircularProgress />;
  }

  if (getUser.queryResult.error) {
    return <Alerts usedAlerts={getAlerts} />;
  }

  if (getUser.queryResult.isFetched) {
    return (
      <Paper sx={{ padding: 2 }}>
        <Typography sx={{ mb: 1 }} variant="body1">
          Filtr - budou odesílány pouze nové nabídky, které vyhovují:
        </Typography>
        <JobsFilterForm id="jobsFilterForm" usedForm={jobsFilterForm} />
        <Box sx={{ mt: 3 }}>
          <Box sx={{ my: 1 }}>
            <Alerts usedAlerts={saveDeleteAlerts} />
          </Box>

          <Box sx={{ display: "inline-flex", gap: 2, flexWrap: "wrap" }}>
            <LoadingButton
              variant="contained"
              loading={subscribeToNewJobNotification.isLoading}
              onClick={async () => {
                subscribeToNewJobNotification.mutate(
                  {
                    userId: user?.userId,
                    filter: jobsFilterForm.getValues(),
                  },
                  {
                    onError: (err) => saveDeleteAlerts.addErrorAlert(err),
                    onSuccess: () => {
                      saveDeleteAlerts.addSuccessAlert();
                      router.push(router.route);
                      queryClient.invalidateQueries(["getUser"]);
                    },
                  }
                );
              }}
            >
              Uložit a dostávat notifikace
            </LoadingButton>

            {getUser.queryResult.data && (
              <LoadingButton
                variant="outlined"
                loading={unsubscribeFromNewJobNotification.isLoading}
                onClick={async () => {
                  unsubscribeFromNewJobNotification.mutate(
                    {
                      userId: user?.userId,
                    },
                    {
                      onError: (err) => saveDeleteAlerts.addErrorAlert(err),
                      onSuccess: () => {
                        saveDeleteAlerts.addSuccessAlert();
                        router.push(router.route);
                        queryClient.invalidateQueries(["getUser"]);
                      },
                    }
                  );
                }}
              >
                Nechci již dostávat notifikace
              </LoadingButton>
            )}
          </Box>
        </Box>
      </Paper>
    );
  }

  return null;
};

export default Notifikace;
