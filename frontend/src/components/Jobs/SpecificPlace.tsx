import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton, Typography } from "@mui/material";
import { IJobReadModel } from "shared/src/resource/job";

export const SpecificPlace = (props: { job: IJobReadModel }) => {
  const { job } = props;
  return (
    <Typography gutterBottom variant="h5" component="div">
      {job ? (
        <>
          <FontAwesomeIcon
            title="upřesněné místo"
            icon={faLocationCrosshairs}
            fixedWidth
          />
          &nbsp;{job.specificPlace}
        </>
      ) : (
        <Skeleton width="130px" />
      )}
    </Typography>
  );
};
