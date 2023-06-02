import { Typography, TypographyProps } from "@mui/material";
import React from "react";

type LoadingTypographyProps = TypographyProps & {
  isLoading: boolean;

};

const Dots = () => {
  // loading text with dots component
  const [dotsCount, setDotsCount] = React.useState(0);
  const [dots, setDots] = React.useState("");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDotsCount((dots) => {
        const newDotsCount = dots < 3 ? dots + 1 : 0;
        setDots(new Array(newDotsCount).fill(".").join(""));
        return newDotsCount;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{dots}</>;
};

// const [dotsCount, setDotsCount] = React.useState(0);

// React.useEffect(() => {
//   setInterval(() => {
//     setDotsCount((dotsCount + 1) % 4);
//   }, 1000);
// }, []);

// return <>{new Array(dotsCount).fill(".").join("")}</>;

export const LoadingTypography = (props: LoadingTypographyProps) => {
  const { isLoading, children, ...typographyProps } = props;

  return (
    <Typography {...typographyProps}>
      {children}
      {isLoading ? <Dots /> : undefined}
    </Typography>
  );
};
