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
import { useVerifyEmailChange } from "../../../hooks/useVerifyEmailChange";

const Overeni: NextPage = () => {
  const router = useRouter();
  const verifyUserChange = useVerifyEmailChange();
  const { token } = router.query;
  useEffect(() => {
    if (router.isReady && typeof token === "string") {
      verifyUserChange.mutateAsync({
        token,
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    console.log("mounted");
  }, []);

  if (verifyUserChange.isLoading) {
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

  if (verifyUserChange.isError) {
    return (
      <Layout>
        <ApiErrorAlert
          error={verifyUserChange.error}
          messageByType={{
            NotFoundError:
              "Žádost o změnu emailu nebyla nalezena. Ke změně již mohlo dojít - zkuste se přihlásit. Platnost žádosti mohla již vypršet - zkuste znovu změnit email.",
          }}
        />
      </Layout>
    );
  }

  if (verifyUserChange.isSuccess) {
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
      <AlertTitle>Nový email nastaven!</AlertTitle>
      Nyní se můžete přihlásit.
    </Alert>
  );
};

const Layout = (props: { children?: React.ReactNode }) => {
  return (
    <Container sx={{ my: 2 }}>
      <Paper sx={{ p: 2 }}>{props.children}</Paper>
    </Container>
  );
};

export default Overeni;
