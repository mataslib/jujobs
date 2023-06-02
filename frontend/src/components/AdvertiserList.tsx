import {
  Box,
  CircularProgress,
  Container,
  Pagination,
  Skeleton,
  Typography,
} from "@mui/material";
import { IAdvertiserReadModel } from "shared/src/resource/advertiser";
import AdvertiserFilter from "./AdvertiserFilter";
import AdvertiserListItem from "./AdvertiserListItem";

export const AdvertiserList = (props: {
  advertisers?: IAdvertiserReadModel[];
  // filterData?: FormFields;
  // onSubmit: (data: FormFields) => void;
  // renderPaginationItem: (params: any) => ReactElement;
  // page?: number;
  // pages?: number;
  // results?: number;
  // isFetching: boolean;
}) => {
  const {
    advertisers,
    filterData,
    onSubmit,
    renderPaginationItem,
    page,
    pages,
    results,
    isFetching,
  } = props;

  return (
    <Container>
      <Box
        sx={{
          marginTop: 3,
        }}
      >
        <AdvertiserFilter
          data={filterData}
          onSubmit={onSubmit}
        ></AdvertiserFilter>
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
        ) : (advertisers ?? []).length > 0 ? (
          <>
            {advertisers.map((advertiser) => (
              <AdvertiserListItem
                key={advertiser._id}
                advertiser={advertiser}
              />
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
        {isFetching ? (
          <Skeleton width={200} height={32} />
        ) : (
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
