import { Skeleton, Typography } from "@mui/material";
import { PlaceIcon } from "./PlaceIcon";

type Props = {
  job: any;
};

export const Place = (props: Props) => {
  const { job } = props;
  return (
    <Typography gutterBottom variant="h5" component="div">
      {job ? (
        <>
          <PlaceIcon place={job.place} />
          &nbsp;{job.place}
        </>
      ) : (
        <Skeleton width="130px" />
      )}
    </Typography>
  );
};
