import * as React from "react";
import AppContext from "../contexts/AppContextProvider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function AppTitle({ isLink = true }) {
  const { navigateTo } = React.useContext(AppContext);
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0}
      onClick={() => {
        if (isLink) navigateTo("/", null, false);
      }}
    >
      <Box
        component="img"
        src="/images/logo.png"
        alt="Triplog Logo"
        sx={{
          width: {
            xs: 30,
            sm: 50,
          },
          height: {
            xs: "37px",
            sm: "55px",
          },
        }}
      />
      <Typography
        variant="h6"
        noWrap
        component="a"
        color="primary"
        sx={{
          mr: 0,
          marginInlineStart: -0.5,
          display: "flex",
          fontFamily: "monospace",
          fontWeight: "bold",
          fontSize: {
            xs: "1.5em",
            sm: "2em"
          },
          letterSpacing: ".1rem",
          textDecoration: "none",
        }}
      >
        riplog
      </Typography>
    </Stack>
  );
}
