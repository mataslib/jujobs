import { Place } from "@mui/icons-material";
import {
  Box,
  Chip,
  Container,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { IJobReadModel } from "shared/src/resource/job";
import { FacultyTypes } from "./Jobs/FacultyTypes";
import { FieldTypes } from "./Jobs/FieldTypes";
import { Homeoffice } from "./Jobs/Homeoffice";
import { Salary } from "./Jobs/Salary";
import { SpecificPlace } from "./Jobs/SpecificPlace";
import { StartDate } from "./Jobs/StartDate";

export const JobSummary = (props: { job: IJobReadModel }) => {
  const isLoading = !props.job;
  const { job } = props;

  return (
    <Container sx={{ my: 2 }}>
      <Paper sx={{ p: 2, position: "relative" }}>
        {/* Title */}
        <Typography variant="h2" component="h1" gutterBottom>
          {!isLoading ? job.title : <Skeleton />}
        </Typography>

        {/* Logo */}
        {job?.advertiser?.logo && (
          <Link
            href={`/inzerent/${job?.advertiser._id}`}
            sx={{
              position: "absolute",
              right: "0",
              top: "0",
              opacity: 0.3,
              gap: 1,
            }}
          >
            <img src={job?.advertiser?.logo} alt="logo" />
          </Link>
        )}

        {/* Reply */}
        {/* <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Button variant="contained">Mám zájem</Button>
          <Deadline job={job} />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            color: theme.palette.text.disabled,
          }}
        >
          <Button variant="contained" disabled>
            Mám zájem
          </Button>
          <Box>
            <Typography>Funkce je dostupná pouze příhlášeným</Typography>
            <Deadline job={job} />
          </Box>
        </Box> */}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
          <Link href={`/inzerent/${job?.advertiser._id}`}>
            <Typography gutterBottom variant="h5" component="div">
              Inzerent:&nbsp;
              {job?.advertiser?.name}
            </Typography>
          </Link>

          <Place job={job} />
          <SpecificPlace job={job} />
          <Homeoffice job={job} />
          {job?.salary ? <Salary job={job} /> : ""}
          {job?.startDate ? <StartDate job={job} /> : ""}
        </Box>

        <Box sx={{ marginTop: 2 }}>
          {isLoading || job.text ? (
            <Box sx={{ my: 3 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 400 }}
              >
                Co Tě na pozici bude čekat
              </Typography>
              <Typography variant="body1" gutterBottom>
                {!isLoading ? job.text : <Skeleton width="200px" />}
              </Typography>
            </Box>
          ) : (
            ""
          )}
          {isLoading || job.requirements ? (
            <Box sx={{ my: 3 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 400 }}
              >
                Jaké znalosti a dovednosti bys měl/a mít?
              </Typography>
              <Typography variant="body1" gutterBottom>
                {!isLoading ? job.requirements : <Skeleton width="200px" />}
              </Typography>
            </Box>
          ) : (
            ""
          )}
          {isLoading || job.benefits ? (
            <Box sx={{ my: 3 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 400 }}
              >
                Co Ti společnost může nabídnout?
              </Typography>
              <Typography variant="body1" gutterBottom>
                {!isLoading ? job.benefits : <Skeleton width="200px" />}
              </Typography>
            </Box>
          ) : (
            ""
          )}
          <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
            Forma spolupráce:&nbsp;
            <Box sx={{ display: "flex", gap: "1px", flexWrap: "wrap" }}>
              {job?.employmentType?.map((employmentType) => (
                <Chip key={employmentType} label={employmentType} />
              ))}
            </Box>
          </Box>
          <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
            Doba spolupráce:&nbsp;
            <Box sx={{ display: "flex", gap: "1px", flexWrap: "wrap" }}>
              {job?.durationType?.map((durationType) => (
                <Chip key={durationType} label={durationType} />
              ))}
            </Box>
          </Box>
          <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
            Druh úvazku:&nbsp;
            <Box sx={{ display: "flex", gap: "1px", flexWrap: "wrap" }}>
              {job?.legalType?.map((legalType) => (
                <Chip key={legalType} label={legalType} />
              ))}
            </Box>
          </Box>
          <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
            Pracovní oblasti:&nbsp;
            <Box sx={{ display: "flex", gap: "1px", flexWrap: "wrap" }}>
              <FieldTypes job={job} />
            </Box>
          </Box>
          <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
            Vhodné pro studenty fakult:&nbsp;
            <Box sx={{ display: "flex", gap: "1px", flexWrap: "wrap" }}>
              <FacultyTypes job={job} />
            </Box>
          </Box>

          {isLoading || job.other ? (
            <Box sx={{ my: 3 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 400 }}
              >
                Jiné
              </Typography>
              <Typography variant="body1" gutterBottom>
                {!isLoading ? job.other : <Skeleton width="200px" />}
              </Typography>
            </Box>
          ) : (
            ""
          )}
        </Box>
      </Paper>
    </Container>
  );
};

const Deadline = (props: { job: IJobReadModel }) => {
  const job = props.job;
  return job ? `Deadline: ${job.deadlineAt}` : <Skeleton width="130px" />;
};
