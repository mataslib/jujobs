import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { Link } from "./Link/Link";
import {
  GetAdvertiserViewData,
  useGetAdvertiserView,
} from "../hooks/useGetAdvertiserView";
import { ApiErrorAlert } from "./ApiErrorAlert";
import React, { ReactNode } from "react";

export const AdvertiserDetail = ({
  advertiserId,
}: {
  advertiserId: string;
}) => {
  const getAdvertiserView = useGetAdvertiserView({
    advertiserId,
  });

  if (getAdvertiserView.queryResult.isError) {
    return (
      <Layout>
        <ApiErrorAlert error={getAdvertiserView.queryResult.error} />
      </Layout>
    );
  }

  if (getAdvertiserView.queryResult.isLoading) {
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    );
  }

  const advertiserView = getAdvertiserView.queryResult.data;

  return (
    <>
      <Box
        sx={{
          marginTop: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AdvertiserLogo advertiserView={advertiserView} />
          <AdvertiserName advertiserView={advertiserView} />
        </Box>

        <AdvertiserWeb advertiserView={advertiserView} />
      </Box>

      <AdvertiserAbout advertiserView={advertiserView} />
    </>
  );
};

const Layout = (props: { children: ReactNode }) => {
  return (
    <Container>
      <Paper sx={{ marginTop: 2, padding: 2, position: "relative" }}>
        {props.children}
      </Paper>
    </Container>
  );
};

const AdvertiserLogo = ({
  advertiserView,
}: {
  advertiserView: GetAdvertiserViewData;
}) => {
  if (!advertiserView?.logo) {
    return null;
  }

  return <img src={advertiserView.logo} alt="logo" />;
};

const AdvertiserName = ({
  advertiserView,
}: {
  advertiserView: GetAdvertiserViewData;
}) => {
  return (
    <Typography variant="h2" component="h1" gutterBottom>
      {/* {!isLoading ? job.title : <Skeleton />} */}
      {advertiserView.name}
    </Typography>
  );
};

const AdvertiserWeb = ({
  advertiserView,
}: {
  advertiserView: GetAdvertiserViewData;
}) => {
  if (!advertiserView?.web) {
    return null;
  }
  return <Link href={advertiserView.web}>{advertiserView.web}</Link>;
};

const AdvertiserAbout = ({
  advertiserView,
}: {
  advertiserView: GetAdvertiserViewData;
}) => {
  if (!advertiserView?.about) {
    return null;
  }

  return (
    <Paper sx={{ marginTop: 2, padding: 2, position: "relative" }}>
      <Typography variant="h3" component="h2" gutterBottom>
        O firmě
      </Typography>
      <Typography variant="body1" component="p">
        {advertiserView.about}
      </Typography>
    </Paper>
  );
};
