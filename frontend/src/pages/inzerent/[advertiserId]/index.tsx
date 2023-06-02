import { Box, Container } from "@mui/material";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useUser } from "src/hooks/useUser";
import { AdvertiserDetail } from "../../../components/AdvertiserDetail";
import { AdvertiserDetailAdminBar } from "../../../components/AdvertiserDetailAdminBar";
import { AdvertiserJobList } from "../../../components/AdvertiserJobList";
import { prefetchGetAdvertiserView } from "../../../hooks/useGetAdvertiserView";
import { assertNotUndefined } from "../../../util/assert";
import { createPrefetcher } from "../../../util/prefetcher";
import { ExtractProps } from "../../../util/typeutils";

const InzerentDetail: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
  const { listJobsFilter, advertiserId } = props;
  const { user } = useUser();

  return (
    <Container>
      {user &&
        (user.roles.includes("admin") ||
          (user.roles.includes("advertiser") &&
            user.advertiserId === advertiserId && (
              <Box sx={{ my: 2, display: "flex", gap: 1 }}>
                <AdvertiserDetailAdminBar advertiserId={advertiserId} />
              </Box>
            )))}
      <AdvertiserDetail advertiserId={advertiserId} />
      <AdvertiserJobList filter={listJobsFilter} />
    </Container>
  );
};

const innerGetStaticProps = async (ctx: GetStaticPropsContext) => {
  assertNotUndefined(ctx.params);
  let advertiserId = ctx.params.advertiserId as string;

  const listJobsFilter = {
    advertiserId: advertiserId,
  };

  const prefetcher = createPrefetcher();
  prefetchGetAdvertiserView(prefetcher, advertiserId);
  // Don't prefetch jobs, so they're up-to-date for tests
  // prefetchListJobs(prefetcher, listJobsFilter);

  const props = {
    ...(await prefetcher.props()),
    listJobsFilter,
    advertiserId,
  };

  let result: GetStaticPropsResult<typeof props> =
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
  // const res = await fetch("https://.../posts");
  // const posts = await res.json();

  // // Get the paths we want to pre-render based on posts
  // const paths = posts.map((post) => ({
  //   params: { id: post.id },
  // }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths: [], fallback: "blocking" };
};

export default InzerentDetail;
