import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#535bf2", // Primary color
          light: "#8E6BF2",
          dark: "#7B6CF2",
          contrastText: "black",
        },
        background: {
          default: "rgb(255, 255, 255)",
          paper: "rgb(241, 237, 255)",
        },
        text: {
          primary: "rgb(6, 41, 79)",
          secondary: "rgb(32, 10, 193)",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#8E6BF2", // Slightly lighter primary for dark mode
          light: "#7B6CF2",
          dark: "#535bf2",
          contrastText: "#FFFFFF",
        },
        background: {
          default: "#1A1A1A", // Dark background
          paper: "#121212",
        },
        text: {
          primary: "rgb(193, 196, 244)",
          secondary: "#8E6BF2",
        },
      },
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          // Changes the header color
          color: theme.palette.primary.contrastText,
          borderBottom: `3px solid ${theme.palette.primary.light}`, // Adds bottom border
          borderRadius: "8px", // Optional for rounded edges
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          //backgroundColor: theme.palette.background.default, // Sidebar background
          color: theme.palette.text.primary,
          borderRight: `1px solid ${theme.palette.primary.main}`,
        }),
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(45deg,rgb(54, 82, 169) 30%,rgb(45, 11, 112) 90%)", // Gradient from soft green to deep green
          border: 0,
          borderRadius: "14px",
          color: "white",
          "&:hover": {
            background:
              "linear-gradient(45deg,rgb(66, 57, 226) 30%,rgb(11, 60, 61) 90%)", // Lighter green gradient on hover
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(45deg,rgb(54, 82, 169) 30%,rgb(45, 11, 112) 90%)", // Gradient from soft green to deep green
          border: 0,
          borderRadius: "14px",
          boxShadow: "0 3px 5px 2px rgba(80, 141, 78, 0.3)", // Green shadow effect
          color: "white",
          height: 48,
          padding: "0 30px",
          "&:hover": {
            background:
              "linear-gradient(45deg,rgb(66, 57, 226) 30%,rgb(11, 60, 61) 90%)", // Lighter green gradient on hover
          },
        },
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: ({ theme }) => ({
        textDecoration: "none", // Remove underline by default
        color: theme.palette.primary.main, // Default color
        fontWeight: 600, // Make text bold
        transition: "color 0.3s ease-in-out", // Smooth transition effect
        "&:hover": {
          color: theme.palette.primary.light, // Change color on hover
          textDecoration: "underline", // Underline on hover
        },
        "&:active": {
          color: theme.palette.primary.dark, // Darker color when clicked
        },
        "&:visited": {
          color: theme.palette.text.secondary, // Color for visited links
        },
      }),
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;
