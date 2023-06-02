import { Chip } from "@mui/material";
import { IJobReadModel } from "shared/src/resource/job";

export const FieldTypes = (props: { job?: IJobReadModel }) => {
  const { job } = props;

  if (!job?.fieldTypes || job.fieldTypes.length <= 0) {
    return null;
  }

  return (
    <>
      {job.fieldTypes.map((fieldType) => (
        <Chip key={fieldType} label={fieldType} />
      ))}
    </>
  );
};
