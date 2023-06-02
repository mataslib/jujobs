import { faMoneyBill1Wave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton, Typography } from "@mui/material";

export const Salary = (props: Props) => {
  const { job } = props;

  return (
    <Typography gutterBottom variant="h5" component="div">
      <FontAwesomeIcon title="odměna" icon={faMoneyBill1Wave} fixedWidth />
      &nbsp;{job.salary}
    </Typography>
  );
};

type Props = {
  job: any;
};
