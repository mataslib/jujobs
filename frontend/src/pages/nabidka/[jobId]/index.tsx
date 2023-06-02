import { CircularProgress, Container, Paper } from "@mui/material";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { JobAdminBar } from "src/components/JobAdminBar";
import { JobReply } from "src/components/JobReply";
import { JobStatusAlerts } from "src/components/JobStatusAlerts";
import { JobSummary } from "src/components/JobSummary";
import { ApiErrorAlert } from "../../../components/ApiErrorAlert";
import {
  prefetchGetJobView,
  useGetJobView,
} from "../../../hooks/useGetJobView";
import { assertNotUndefined } from "../../../util/assert";
import { createPrefetcher } from "../../../util/prefetcher";
import { ExtractProps } from "../../../util/typeutils";

const Nabidka: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { jobId } = props;
  const getJobView = useGetJobView({
    jobId: jobId,
  });

  if (getJobView.queryResult.isLoading) {
    return (
      <Container sx={{ my: 2 }}>
        <Paper sx={{ p: 2, position: "relative" }}>
          <CircularProgress />
        </Paper>
      </Container>
    );
  }

  // Fetch error
  if (getJobView.queryResult.error) {
    return (
      <Container sx={{ my: 2 }}>
        <Paper sx={{ p: 2, position: "relative" }}>
          <ApiErrorAlert error={getJobView.queryResult.error} />
        </Paper>
      </Container>
    );
  }

  if (getJobView.queryResult.data) {
    return (
      <div>
        <JobAdminBar job={getJobView.queryResult.data} />
        <JobStatusAlerts job={getJobView.queryResult.data} />
        <JobSummary job={getJobView.queryResult.data} />
        <JobReply job={getJobView.queryResult.data} />
      </div>
    );
  }

  throw `Should not be reached ever.`;
};

//
// NextJS
//
const innerGetStaticProps = async (ctx: GetStaticPropsContext) => {
  assertNotUndefined(ctx.params);
  const jobId = ctx.params.jobId as string;
  console.log(jobId);

  const prefetcher = createPrefetcher();
  prefetchGetJobView(prefetcher, jobId);

  const props = {
    jobId,
    ...(await prefetcher.props()),
  };

  const result: GetStaticPropsResult<typeof props> =
    props.dehydratedState.queries.length > 0
      ? {
          props,
          revalidate: 60,
        }
      : {
          notFound: true,
        };

  return result;
};
export const getStaticProps: GetStaticProps<
  ExtractProps<typeof innerGetStaticProps>
> = innerGetStaticProps;

export const getStaticPaths: GetStaticPaths = async () => {
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths: [], fallback: "blocking" };
};
export default Nabidka;
