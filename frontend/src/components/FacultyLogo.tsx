import { Avatar } from "@mui/material";

export const FacultyLogo = (props: { faculty: keyof typeof facultyMap }) => {
  const { faculty } = props;
  // return <div>{faculty}</div>;
  return (
    <Avatar
      sx={{ width: 32, height: 32, bgcolor: "white" }}
      alt={faculty}
      title={faculty}
      src={`/logo/${facultyMap[faculty]}.svg`}
    />
  );
  // <Typography gutterBottom variant="h5" component="div">
  //   {job ? (
  //     <>
  //       <PlaceIcon place={job.place} />
  //       &nbsp;{job.place}
  //     </>
  //   ) : (
  //     <Skeleton width="130px" />
  //   )}
  // </Typography>
};

const facultyMap = {
  "Rybářství a ochrany vod": "frov",
  "Zdravotně sociální": "zsf",
  "Zemědělská a technologická": "fzt",
  Ekonomická: "ef",
  Přírodovědecká: "prf",
  Filozofická: "ff",
  Teologická: "tf",
  Pedagogická: "pf",
} as const;
