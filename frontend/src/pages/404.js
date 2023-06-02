/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Error from "next/error";
import { Box } from "@mui/material";
import { appbarHeight } from "../adapters/styling/cssInJs/theme";

export default function Custom404() {
  return (
    <Box
      css={css({
        ["& > *"]: { height: `calc(100vh - ${appbarHeight}px)!important` },
      })}
    >
      <Error statusCode={404} />
    </Box>
  );
}
