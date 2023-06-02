import { PaginationItem } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AdvertiserList } from "../../components/AdvertiserList";
import { Link } from "../../components/Link/Link";
// import { useAdvertisers } from "../data/useAdvertisers";
import { useListAdvertisers } from "../../hooks/useListAdvertisers";
import { parsedQuerystring, stringifyQuerystring } from "../../util/utils";

const InzerentiHledat: NextPage = (props) => {
  const [urlFilter, setUrlFilter] = useState({});
  const router = useRouter();

  useEffect(() => {
    setUrlFilter(parsedQuerystring());
  }, [router]);

  const listAdvertisers = useListAdvertisers({
    search: {
      ...urlFilter,
      page: urlFilter?.page ?? 1,
    },
    queryOptions: {
      staleTime: 60000,
      // initialData: props.jobsResponse,
    },
  });

  const onSubmit = (data) => {
    return router.push(`/inzerenti/hledat?${stringifyQuerystring(data)}`);
    // listAdvertisers.setFilter(data);
    // listAdvertisers.queryResult.refetch();
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdvertiserList
        filterData={urlFilter}
        advertisers={listAdvertisers.queryResult.data?.results}
        isFetching={listAdvertisers.queryResult.isFetching}
        onSubmit={onSubmit}
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
                  : `/inzerenti/hledat?${stringifyQuerystring({
                      ...listAdvertisers.filter,
                      page: params.page,
                    })}`
              }
            >
              <PaginationItem {...params}>{params.page}</PaginationItem>
            </Link>
          );
        }}
        // meta: {total: 1, limit: 100, page: 1, pages: 1}
      />
    </>
  );
};

export default InzerentiHledat;
