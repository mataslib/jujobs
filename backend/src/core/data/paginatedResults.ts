export const paginatedResults = <TResults>(props: {
  results: TResults;
  total: number;
  page: number;
  limit: number;
}) => {
  const {results, total, page, limit} = props;
  const skip = (page - 1) * limit;
  const pages = Math.ceil(total / limit);

  return {
    results,
    meta: {
      total,
      page,
      pages,
      skip,
      limit,
    },
  };
};
