import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function AppTitle() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0}
      sx={{ marginInlineStart: 1 }}
    >
      <LocalShippingIcon fontSize="large" color="primary" />
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="#app-bar-with-responsive-menu"
        color="primary"
        sx={{
          mr: 2,
          display: "flex",
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".1rem",
          textDecoration: "none",
        }}
      >
        TripLog
      </Typography>
    </Stack>
  );
}