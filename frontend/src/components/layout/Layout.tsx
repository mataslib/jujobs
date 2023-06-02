import { Box } from "@mui/material";
import React from "react";
import { appbarHeight } from "../../adapters/styling/cssInJs/theme";
import ResponsiveAppBar from "../AppBar/AppBar";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: `${appbarHeight}px minmax(calc(100vh - ${appbarHeight}px), auto)`,
        gridTemplateColumns: "100%",

        // flexDirection: { xs: 'column', md: 'row' },
        // alignItems: 'center',
        // bgcolor: 'background.paper',
        // overflow: 'hidden',
        // borderRadius: '12px',
        // boxShadow: 1,
        // fontWeight: 'bold',
      }}
    >
      <Box>
        <ResponsiveAppBar />
      </Box>
      {props.children}
    </Box>
  );
};

export default Layout;
