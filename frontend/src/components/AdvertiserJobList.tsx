import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { ListJobsSearch, useListJobs } from "../hooks/useListJobs";
import { ApiErrorAlert } from "./ApiErrorAlert";
import JobListItem from "./Jobs/JobListItem";

export const AdvertiserJobList = ({ filter }: { filter: ListJobsSearch }) => {
  const listJobs = useListJobs({
    search: filter,
  });

  if (listJobs.queryResult.isError) {
    return (
      <Layout>
        <ApiErrorAlert error={listJobs.queryResult.error} />
      </Layout>
    );
  }

  if (listJobs.queryResult.isFetching || !listJobs.queryResult.data) {
    return <Layout>{/* <JobListItem skeleton={true} /> */}</Layout>;
  }

  if (listJobs.queryResult.data.results.length === 0) {
    return <Layout>Nic nenalezeno</Layout>;
  }

  return (
    <Layout>
      {listJobs.queryResult.data.results.map((job) => (
        <JobListItem key={job._id} job={job} />
      ))}
    </Layout>
  );
};

const Layout = (props: { children: ReactNode }) => {
  return (
    <>
      <Box sx={{ marginTop: 2 }}>
        <Typography id="joblist" variant="h3" component="h2" gutterBottom>
          Naše pracovní nabídky
        </Typography>
      </Box>

      <Box
        sx={{
          // marginTop: 3,
          display: "grid",
          gap: 2,
        }}
      >
        {props.children}
      </Box>
    </>
  );
};
