export const buildPaginatedPipeline = (opts: {page: number; limit: number}) => {
  const {page, limit} = opts;
  const skip = (page - 1) * limit;

  return {
    stages: [
      {
        $facet: {
          total: [
            {
              $count: 'total',
            },
          ],
          results: [],
        },
      },
      {
        $project: {
          meta: {
            total: {
              $ifNull: [{$arrayElemAt: ['$total.total', 0]}, 0],
            },
          },
          results: '$results',
        },
      },
      {
        $project: {
          results: {
            $cond: {
              if: {$gt: ['$meta.total', 0]},
              then: {
                $slice: [
                  '$results',
                  skip,
                  {
                    $ifNull: [limit, '$meta.total'],
                  },
                ],
              },
              else: [],
            },
          },
          meta: {
            total: '$meta.total',
            limit: {
              $literal: limit,
            },
            page: {
              $literal: page,
            },
            returned: {
              $min: [{$subtract: ['$meta.total', skip]}, limit],
            },
            pages: {
              $cond: {
                if: {$gt: ['$meta.total', 0]},
                then: {
                  $ceil: {
                    $divide: ['$meta.total', limit],
                  },
                },
                else: 0,
              },
            },
          },
        },
      },
    ],
  };
};

export type WithPaginatedPipeline<TResults> = {
  results: TResults;
  meta: {
    total: number;
    page: number;
    pages: number;
  };
};
