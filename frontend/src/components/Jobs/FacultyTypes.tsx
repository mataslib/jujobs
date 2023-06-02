import { AvatarGroup } from "@mui/material";
import { IJobReadModel } from "shared/src/resource/job";
import { FacultyLogo } from "../FacultyLogo";

export const FacultyTypes = (props: { job?: IJobReadModel }) => {
  const { job } = props;

  if (!job?.facultyTypes || job.facultyTypes.length <= 0) {
    return null;
  }

  return (
    <AvatarGroup max={Infinity}>
      {job.facultyTypes.map((facultyType) => (
        <FacultyLogo key={facultyType} faculty={facultyType} />
      ))}
    </AvatarGroup>
  );
};
