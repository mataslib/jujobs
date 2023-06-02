import { Button, Link } from "@mui/material";
import { IJobReadModel } from "shared/src/resource/job";
import { useArchiveJob } from "../hooks/useArchiveJob";
import { useDeleteJob } from "../hooks/useDeleteJob";
import { ApproveJobButton } from "./ApproveJobButton";
import { ArchiveJobButton } from "./ArchiveJobButton";
import { DeleteJobButton } from "./DeleteJobButton";

export const JobDetailUniversityAdminBar = (props: { job: IJobReadModel }) => {
  const { job } = props;
  
 

  return (
    <>
      <Link href={`/nabidka/${job._id}/upravit`}>
        <Button variant="contained">Upravit</Button>
      </Link>

      {!job.approved && <ApproveJobButton job={job} />}
      {!job.archived && (
        <ArchiveJobButton job={job}  />
      )}
      <DeleteJobButton job={job} />
    </>
  );
};
