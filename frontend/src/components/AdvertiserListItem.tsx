import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import { IAdvertiserReadModel } from "shared/src/resource/advertiser";
import { Link } from "./Link/Link";

type JobListItemProps = {
  advertiser?: IAdvertiserReadModel;
  // skeleton?: boolean;
};

// JobView
export default function AdvertiserListItem(props: JobListItemProps) {
  const { advertiser } = props;

  return (
    <Link
      href={advertiser ? `/inzerent/${advertiser._id}` : null}
      underline="none"
    >
      <Card sx={{}}>
        <CardActionArea tabIndex={-1}>
          <CardContent>
            <Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box sx={{ width: "100%" }}>
                  <Typography gutterBottom variant="h3" component="div">
                    {advertiser ? advertiser.name : <Skeleton width="75%" />}
                  </Typography>

                  {/* <Box
                    sx={{
                      my: 1,
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      width: "100%",
                    }}
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      {advertiser ? advertiser.name : <Skeleton />}
                    </Typography>
                  </Box> */}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
