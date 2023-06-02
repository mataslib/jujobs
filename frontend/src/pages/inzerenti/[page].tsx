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
import { AdvertiserList } from "../../components/AdvertiserList";
import { Link } from "../../components/Link/Link";
import {
  prefetchListAdvertisers,
  useListAdvertisers,
} from "../../hooks/useListAdvertisers";
import { assertNotUndefined } from "../../util/assert";
import { createPrefetcher } from "../../util/prefetcher";
import { stringifyQuerystring } from "../../util/utils";

const Inzerenti: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const listAdvertisers = useListAdvertisers({
    search: {
      page: props.page,
    },
  });
  const router = useRouter();

  return (
    <AdvertiserList
      advertisers={listAdvertisers.queryResult.data?.results}
      isFetching={listAdvertisers.queryResult.isFetching}
      onSubmit={(filter) => {
        return router.push(`/inzerenti/hledat?${stringifyQuerystring(filter)}`);
      }}
      page={listAdvertisers.queryResult.data?.meta?.page}
      pages={listAdvertisers.queryResult.data?.meta?.pages}
      results={listAdvertisers.queryResult.data?.meta?.total}
      renderPaginationItem={(params) => {
        return (
          <Link
            noLinkStyle
            href={
              params.disabled || params.selected || params.page === null
                ? null
                : `/inzerenti/${params.page}`
            }
          >
            <PaginationItem {...params}>{params.page}</PaginationItem>
          </Link>
        );
      }}
    />
  );
};

const innerGetStaticProps = async (ctx: GetStaticPropsContext) => {
  assertNotUndefined(ctx.params);
  const page = ctx.params?.page ? parseInt(ctx.params.page as string) : 1;
  const filter = {
    page,
  };

  const prefetcher = createPrefetcher();
  prefetchListAdvertisers(prefetcher, filter);

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

export default Inzerenti;
