import { Button, Link } from "@mui/material";
import { IJobReadModel } from "shared/src/resource/job";
import { useArchiveJob } from "../hooks/useArchiveJob";
import { useDeleteJob } from "../hooks/useDeleteJob";
import { Alerts, useAlerts } from "./Alerts";
import { ArchiveJobButton } from "./ArchiveJobButton";
import { DeleteJobButton } from "./DeleteJobButton";

export const JobDetailAdvertiserAdminBar = (props: { job: IJobReadModel }) => {
  const { job } = props;
  const alerts = useAlerts();
  const deleteJob = useDeleteJob();
  const archiveJob = useArchiveJob();

  return (
    <>
      <Link href={`/nabidka/${job._id}/upravit`}>
        <Button variant="contained">Upravit</Button>
      </Link>

      <ArchiveJobButton job={job} usedArchiveJob={archiveJob} />
      <DeleteJobButton job={job} usedDeleteJob={deleteJob} />

      <Alerts usedAlerts={alerts} />
    </>
  );
};
