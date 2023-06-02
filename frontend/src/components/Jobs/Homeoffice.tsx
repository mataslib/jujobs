import { faWifi } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton, Typography } from "@mui/material";
import theme from "../../adapters/styling/cssInJs/theme";

export const Homeoffice = (props: Props) => {
  const { job } = props;

  return (
    <Typography gutterBottom variant="h5" component="div">
      {job ? (
        <div
          style={{
            ...(job.homeoffice ? {} : { color: theme.palette.action.disabled }),
          }}
        >
          <FontAwesomeIcon
            title="možnost homeoffice"
            icon={faWifi}
            fixedWidth
          />
          &nbsp;
          <span
            style={{
              ...(job.homeoffice ? {} : { textDecoration: "line-through" }),
            }}
          >
            Možnost&nbsp;homeoffice
          </span>
        </div>
      ) : (
        <Skeleton width="130px" />
      )}
    </Typography>
  );
};

type Props = {
  job: any;
};
