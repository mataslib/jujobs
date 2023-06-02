import { Skeleton } from "@mui/material";
import { ReactNode } from "react";

export const WithSkeleton = (props: {
  children: ReactNode;
  showSkeleton: any;
}) => {
  if (!!props.showSkeleton) {
    return <Skeleton>{props.children}</Skeleton>;
  }

  return <>{props.children}</>;
};
