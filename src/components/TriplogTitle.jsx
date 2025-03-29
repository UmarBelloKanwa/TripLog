import * as React from "react";
import AppContext from "../contexts/AppContextProvider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function AppTitle({isLink = true}) {
  const { navigateTo } = React.useContext(AppContext);
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0}
      onClick={() => { if (isLink) navigateTo("/"); }}
    >
      <Box component="img" src="/logoOne.png" alt="Triplog Logo" sx={{ width: 50, height: "55px"}} />
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
          fontSize: "2em",
          letterSpacing: ".1rem",
          textDecoration: "none",
        }}
      >
        riplog
      </Typography>
    </Stack>
  );
}