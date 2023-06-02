import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { IJobReadModel } from "shared/src/resource/job";
import { useUser } from "../hooks/useUser";
import { stringifyQuerystring } from "../util/utils";
import JobListItem from "./Jobs/JobListItem";
import JobsFilterForm, {
  FormFields,
  useJobsFilterForm,
} from "./Jobs/JobsFilterForm";

export const JobList = (props: {
  jobs?: IJobReadModel[];
  filterData?: FormFields;
  onSubmit: (data: FormFields) => void;
  renderPaginationItem: (params: any) => ReactElement;
  page?: number;
  pages?: number;
  results?: number;
  isFetching: boolean;
}) => {
  const {
    jobs,
    filterData,
    onSubmit,
    renderPaginationItem,
    page = 1,
    pages,
    results,
    isFetching,
  } = props;

  const router = useRouter();
  const jobsFilterForm = useJobsFilterForm();
  const { user } = useUser();

  useEffect(() => {
    if (filterData) {
      jobsFilterForm.reset(filterData);
    }
  }, [filterData]);

  return (
    <Container>
      <Box
        sx={{
          marginTop: 3,
        }}
      >
        <Paper sx={{ padding: 0 }}>
          <JobsFilterForm
            id="jobsFilterForm"
            onSubmit={onSubmit}
            usedForm={jobsFilterForm}
          />

          <Box sx={{ marginTop: 1, position: "sticky", left: 0 }}>
            <LoadingButton
              form="jobsFilterForm"
              type="submit"
              variant="outlined"
              loading={isFetching}
            >
              Hledat
            </LoadingButton>

            {user && user.roles.includes("student") && (
              <Button
                onClick={() => {
                  router.push(
                    `/student/notifikace?filter=1&${stringifyQuerystring(
                      jobsFilterForm.getValues()
                    )}`
                  );
                }}
              >
                Použít jako filtr pro notifikace
              </Button>
            )}
          </Box>
        </Paper>
      </Box>

      <Box
        sx={{
          marginTop: 3,
          display: "grid",
          gap: 2,
        }}
      >
        {isFetching ? (
          <CircularProgress sx={{ margin: "0 auto" }} />
        ) : jobs && jobs.length > 0 ? (
          <>
            {jobs.map((job) => (
              <JobListItem key={job._id} job={job} />
            ))}
          </>
        ) : (
          "Nic nenalezeno"
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          justifyContent: "center",
          mt: 2,
        }}
      >
        {!isFetching && (
          <>
            <Pagination
              hideNextButton
              hidePrevButton
              count={pages}
              page={page ?? 1}
              color="primary"
              renderItem={renderPaginationItem}
            />
            <Typography
              sx={{
                textAlign: "center",
                mt: 1,
              }}
              variant="body1"
            >
              Nalezeno:&nbsp;{results}
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
};
