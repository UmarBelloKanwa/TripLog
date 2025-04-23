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
        if (isLink) navigateTo("/");
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
            sm: "2em",
          },
          textDecoration: "none",
        }}
      >
        riplog
      </Typography>
    </Stack>
  );
}

export const Title = ({ value, Icon, onClick }) => {
  let TheIcon = Icon;
  return (
    <Box
      component="span"
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        paddingInlineStart: 1,
      }}
      onClick={onClick}
    >
      {<TheIcon sx={{ mr: 2.8 }} />}
      {value}
    </Box>
  );
};
