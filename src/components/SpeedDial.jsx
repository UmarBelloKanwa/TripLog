import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDl from "@mui/material/SpeedDial";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import EditIcon from "@mui/icons-material/Edit";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AppContext from "../contexts/AppContextProvider";

export default function SpeedDial() {
  const { navigateTo } = React.useContext(AppContext);

  const actions = [
    {
      icon: <FormatAlignLeftIcon />,
      name: "Use form",
      onClick: () => navigateTo("/create-trip", "form"),
    },
    {
      icon: <EditIcon />,
      name: "Use text",
      onClick: () => navigateTo("/create-trip", "text"),
    },
  ];
  return (
    <Box sx={{ flexGrow: 1 }}>
      <SpeedDl
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 55, right: 51 }}
        icon={<SpeedDialIcon />}
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
