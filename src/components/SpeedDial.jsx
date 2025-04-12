import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDl from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AppContext from "../contexts/AppContextProvider";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import CreateIcon from "@mui/icons-material/Create";

export default function SpeedDial() {
  const { navigateTo } = React.useContext(AppContext);
  const navigate = (r) => navigateTo(r, false);
  const actions = [
    {
      icon: <ViewTimelineIcon />,
      name: "View Trips",
      onClick: () => navigate("/my-trips"),
    },
    {
      icon: <CreateIcon />,
      name: "Create Trip",
      onClick: () => navigate("/create-trip"),
    },
  ];
  return (
    <Box sx={{ flexGrow: 1 }}>
      <SpeedDl
        ariaLabel="SpeedDial"
        sx={{
          position: "absolute",
          bottom: {
            xs: 65,
            sm: 55,
          },
          right: {
            xs: 23,
            sm: 51,
          },
          "& button": {
            background:
              "linear-gradient(45deg,rgb(54, 82, 169) 30%,rgb(45, 11, 112) 90%)", // Gradient from soft green to deep green
            color: "white",
            boxShadow: "0 3px 5px 2px rgba(80, 141, 78, 0.3)",
            "&:hover": {
              background:
                "linear-gradient(45deg,rgb(66, 57, 226) 30%,rgb(11, 60, 61) 90%)", // Lighter green gradient on hover
            },
          },
        }}
        icon={<SpeedDialIcon color="primary" />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDl>
    </Box>
  );
}
