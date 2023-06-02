import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton, Typography } from "@mui/material";

export const StartDate = (props: Props) => {
  const { job } = props;

  return (
    <Typography gutterBottom variant="h5" component="div">
      <FontAwesomeIcon title="nástup do práce" icon={faClock} fixedWidth />
      &nbsp;nástup:&nbsp;{job.startDate}
    </Typography>
  );
};

type Props = {
  job: any;
};
