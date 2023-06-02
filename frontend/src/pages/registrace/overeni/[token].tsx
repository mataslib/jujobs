import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ApiErrorAlert } from "../../../components/ApiErrorAlert";
import { LoadingTypography } from "../../../components/LoadingTypography";
import { useVerifyAdvertiser } from "../../../hooks/useVerifyAdvertiser";

const Overeni: NextPage = () => {
  const router = useRouter();
  const verifyAdvertiser = useVerifyAdvertiser();
  const { token } = router.query;
  useEffect(() => {
    if (router.isReady && typeof token === "string") {
      verifyAdvertiser.mutateAsync({
        token,
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    console.log("mounted");
  }, []);

  if (verifyAdvertiser.isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ m: 1 }} />
          <LoadingTypography isLoading={true}>Ověřuji</LoadingTypography>
        </Box>
      </Layout>
    );
  }

  if (verifyAdvertiser.isError) {
    return (
      <Layout>
        <ApiErrorAlert
          error={verifyAdvertiser.error}
          messageByType={{
            NotFoundError:
              "Žádost o ověření nebyla nalezena. K ověření již mohlo dojít - zkuste se přihlásit. Platnost žádosti mohla již vypršet - zkuste se znovu zaregistrovat.",
          }}
        />
      </Layout>
    );
  }

  if (verifyAdvertiser.isSuccess) {
    return (
      <Layout>
        <SuccessAlert />
      </Layout>
    );
  }

  return <Layout />;
};

const SuccessAlert = () => {
  return (
    <Alert severity="success">
      <AlertTitle>Úspěšně ověřeno!</AlertTitle>
      Nyní se můžete přihlásit.
    </Alert>
  );
};

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <Container sx={{ my: 2 }}>
      <Paper sx={{ p: 2 }}>{props.children}</Paper>
    </Container>
  );
};

export default Overeni;
