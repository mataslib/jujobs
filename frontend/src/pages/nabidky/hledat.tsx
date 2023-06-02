import { PaginationItem } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { JobList } from "../../components/JobList";
import { FormFields } from "../../components/Jobs/JobsFilterForm";
import { Link } from "../../components/Link/Link";
import { useListJobs } from "../../hooks/useListJobs";
import { parsedQuerystring, stringifyQuerystring } from "../../util/utils";

const NabidkyHledat: NextPage = (props) => {
  const [urlFilter, setUrlFilter] = useState<FormFields & { page?: number }>(
    {}
  );
  const router = useRouter();
  useEffect(() => {
    const parsed = parsedQuerystring() as Partial<FormFields> & {
      page?: number;
    };
    setUrlFilter(parsed);
  }, [router]);

  const listJobs = useListJobs({
    search: {
      fulltext: urlFilter.fulltext,
      homeoffice: urlFilter.homeoffice,
      place: urlFilter.place,
      employmentType: urlFilter.employmentType,
      legalType: urlFilter.legalType,
      durationType: urlFilter.durationType,
      ...(urlFilter.showOnlyNotApproved ? { approved: false } : {}),
      page: urlFilter?.page ?? 1,
    },
  });

  return (
    <>
      <Head>
        {/* SSG /nabidky/1 is already indexed */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <JobList
        filterData={urlFilter}
        jobs={listJobs.queryResult.data?.results}
        isFetching={listJobs.queryResult.isFetching}
        onSubmit={async (formData) => {
          return router.push(
            `/nabidky/hledat?${stringifyQuerystring(formData)}`
          );
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
                  : `/nabidky/hledat?${stringifyQuerystring({
                      ...urlFilter,
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

export default NabidkyHledat;
