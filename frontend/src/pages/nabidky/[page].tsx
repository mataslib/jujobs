import { PaginationItem } from "@mui/material";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { JobList } from "../../components/JobList";
import { Link } from "../../components/Link/Link";
import { prefetchListJobs, useListJobs } from "../../hooks/useListJobs";
import { assertNotUndefined } from "../../util/assert";
import { createPrefetcher } from "../../util/prefetcher";
import { stringifyQuerystring } from "../../util/utils";

const Nabidky: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const listJobs = useListJobs({
    search: {
      page: props.page,
    },
  });
  const router = useRouter();

  return (
    <JobList
      jobs={listJobs.queryResult.data?.results}
      isFetching={listJobs.queryResult.isFetching}
      onSubmit={(filter) => {
        return router.push(`/nabidky/hledat?${stringifyQuerystring(filter)}`);
      }}
      page={listJobs.queryResult.data?.meta?.page}
      pages={listJobs.queryResult.data?.meta?.pages}
      results={listJobs.queryResult.data?.meta?.total}
      renderPaginationItem={(params) => {
        return (
          <Link
            noLinkStyle
            href={
              params.disabled || params.selected || params.page === null
                ? null
                : `/nabidky/${params.page}`
            }
          >
            <PaginationItem {...params}>{params.page}</PaginationItem>
          </Link>
        );
      }}
    />
  );
};

// 
// NextJS
// 
const innerGetStaticProps = async (ctx: GetStaticPropsContext) => {
  assertNotUndefined(ctx.params);
  const page = ctx.params?.page ? parseInt(ctx.params.page as string) : 1;

  const prefetcher = createPrefetcher();
  prefetchListJobs(prefetcher, {
    page,
  });

  const props = {
    ...(await prefetcher.props()),
    page,
  };

  const result: GetStaticPropsResult<typeof props> = {
    props,
    revalidate: 60,
  };

  return result;
};
export const getStaticProps: GetStaticProps<
  Awaited<ReturnType<typeof innerGetStaticProps>>["props"]
> = innerGetStaticProps;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default Nabidky;
