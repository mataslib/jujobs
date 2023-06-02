import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
  useTheme,
} from "@mui/material";
import { IJobReadModel } from "shared/src/resource/job";
import { Link } from "../Link/Link";
import { FacultyTypes } from "./FacultyTypes";
import { Homeoffice } from "./Homeoffice";
import { Place } from "./Place";
import { Salary } from "./Salary";
import { StartDate } from "./StartDate";

export default function JobListItem(props: { job: IJobReadModel }) {
  const { job } = props;
  const theme = useTheme();

  return (
    <Link href={`/nabidka/${job._id}`} underline="none">
      <Card
        sx={{
          ...(!job.approved || job.archived
            ? {
                backgroundColor: `${theme.palette.warning.main}15`,
                opacity: 0.8,
                boxShadow: "none",
              }
            : {}),
        }}
      >
        <CardActionArea tabIndex={-1}>
          <CardContent>
            <Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box sx={{ width: "100%" }}>
                  <LogoMobile job={job} />

                  <Typography gutterBottom variant="h3" component="div">
                    {job.title}
                  </Typography>

                  {(!job.approved || job.archived) && (
                    <Box>
                      {!job.approved && (
                        <Typography sx={{ color: theme.palette.warning.main }}>
                          Neschválené
                        </Typography>
                      )}
                      {job.archived && (
                        <Typography sx={{ color: theme.palette.warning.main }}>
                          Archivované
                        </Typography>
                      )}
                    </Box>
                  )}

                  <Box
                    sx={{
                      my: 1,
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      width: "100%",
                    }}
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      {job.advertiser?.name}
                    </Typography>

                    <Place job={job} />
                    <Homeoffice job={job} />
                    <Salary job={job} />
                    <StartDate job={job} />
                  </Box>
                </Box>

                <LogoDesktop job={job} />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: "2px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {job.employmentType?.map((employmentType) => (
                  <Chip
                    key={employmentType}
                    label={employmentType}
                    title="Druh úvazku"
                  />
                ))}
                {job.durationType?.map((durationType) => (
                  <Chip
                    key={durationType}
                    label={durationType}
                    title="Typ spolupráce"
                  />
                ))}
                {job.legalType?.map((legalType) => (
                  <Chip
                    key={legalType}
                    label={legalType}
                    title="Doba spolupráce"
                  />
                ))}

                <FacultyTypes job={job} />
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

const LogoMobile = (props) => {
  const { job } = props;
  if (!job?.advertiser?.logo) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: 1,
        display: { sm: "none" },
        float: "right",
      }}
    >
      <img src={job.advertiser?.logo} alt="logo" style={{}} />
    </Box>
  );
};

const LogoDesktop = (props) => {
  const { job } = props;
  if (!job?.advertiser?.logo) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: 1,
        marginLeft: "auto",
        display: { xs: "none", sm: "initial" },
      }}
    >
      <img src={job.advertiser?.logo} alt="logo" style={{}} />
    </Box>
  );
};
