import type { NextPage } from "next";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box, Paper } from "@mui/material";
import { height } from "@mui/system";
import theme from "../adapters/styling/cssInJs/theme";

const Styleguide: NextPage = () => {
  return (
    <Container>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
        return (
          <Box key={index} sx={{ marginBottom: item }}>
            Spacing {item}: {theme.spacing(item)}
          </Box>
        );
      })}

      <Box>Breakpoints {JSON.stringify(theme.breakpoints.values)}</Box>

      <Box
        component="span"
        sx={{ width: theme.spacing(1), bgcolor: "primary.main" }}
      ></Box>

      <Paper>
        <Typography variant="h1" component="div" gutterBottom>
          h1. Heading
        </Typography>
        <Typography variant="h2" gutterBottom component="div">
          h2. Heading
        </Typography>
        <Typography variant="h3" gutterBottom component="div">
          h3. Heading
        </Typography>
        <Typography variant="h4" gutterBottom component="div">
          h4. Heading
        </Typography>
        <Typography variant="h5" gutterBottom component="div">
          h5. Heading
        </Typography>
        <Typography variant="h6" gutterBottom component="div">
          h6. Heading
        </Typography>
        <Typography variant="subtitle1" gutterBottom component="div">
          subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="subtitle2" gutterBottom component="div">
          subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="body1" gutterBottom>
          body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="body2" gutterBottom>
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="button" display="block" gutterBottom>
          button text
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          caption text
        </Typography>
        <Typography variant="overline" display="block" gutterBottom>
          overline text
        </Typography>
      </Paper>

      <code style={{ whiteSpace: "break-spaces" }}>
        {JSON.stringify(theme, null, "\t")}
      </code>
    </Container>
  );
};

export default Styleguide;
