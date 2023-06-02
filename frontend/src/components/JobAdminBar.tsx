import { Container } from "@mui/material";
import { IJobReadModel } from "shared/src/resource/job";
import { useUser } from "src/hooks/useUser";
import { JobDetailAdvertiserAdminBar } from "./JobDetailAdvertiserAdminBar";
import { JobDetailUniversityAdminBar } from "./JobDetailUniversityAdminBar";

export const JobAdminBar = (props: { job: IJobReadModel }) => {
  const { user } = useUser();
  const { job } = props;

  const shouldRenderUniversityAdminBar =
    user && user.roles.includes("admin") && job;
  const shouldRenderAdvertiserAdminBar =
    user &&
    user.roles.includes("advertiser") &&
    job &&
    job.advertiser._id === user.advertiserId;
  const shouldRender =
    shouldRenderUniversityAdminBar || shouldRenderAdvertiserAdminBar;

  if (!shouldRender) {
    return null;
  }

  return (
    <Container sx={{ my: 2, display: "flex", gap: 1 }}>
      {shouldRenderUniversityAdminBar ? (
        <JobDetailUniversityAdminBar job={job} />
      ) : shouldRenderAdvertiserAdminBar ? (
        <JobDetailAdvertiserAdminBar job={job} />
      ) : (
        (null as never)
      )}
    </Container>
  );
};
