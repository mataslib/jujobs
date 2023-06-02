import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";

let defaultTheme = createTheme();
export const appbarHeight = 70;

// Create a theme instance.
let theme = createTheme({
  palette: {
    // mode: 'dark',
    primary: {
      main: "#e00034",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#f8f8f8",
      footer: "red",
    },
  },
  typography: {
    h1: {
      fontSize: `${
        parseFloat(defaultTheme.typography.h1.fontSize) * (2 / 3)
      }rem`,
    },
    h2: {
      fontSize: `${
        parseFloat(defaultTheme.typography.h2.fontSize) * (2 / 3)
      }rem`,
    },
    h3: {
      fontSize: `${
        parseFloat(defaultTheme.typography.h3.fontSize) * (2 / 3)
      }rem`,
    },
    h4: {
      fontSize: `${
        parseFloat(defaultTheme.typography.h4.fontSize) * (2 / 3)
      }rem`,
    },
    h5: {
      fontSize: `${
        parseFloat(defaultTheme.typography.h5.fontSize) * (3 / 4)
      }rem`,
    },
    h6: {
      fontSize: `${
        parseFloat(defaultTheme.typography.h6.fontSize) * (3 / 4)
      }rem`,
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
