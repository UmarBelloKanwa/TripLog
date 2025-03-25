import React, { useContext } from "react";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import AppContext from "../contexts/AppContextProvider";
import { ThemeSwitcher } from "@toolpad/core/DashboardLayout";

export default function Toolbar() {
    const { data } = useContext(AppContext);
    const tooltip = data.settings.isDarkMode ? "Dark mode" : "Light mode";
  
  return (
    <Stack direction="row">
      <ThemeSwitcher />
      <Tooltip title={tooltip} enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label={tooltip}
            sx={{
              display: "inline",
            }}
          >
            <HelpIcon />
          </IconButton>
        </div>
      </Tooltip>
    </Stack>
  );
}
