import * as React from "react";
import { useContext } from "react";
import { default as ApBar } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MenuIcon from "@mui/icons-material/Menu";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AppContext from "../contexts/AppContextProvider";

export default function AppBar() {
  const { data, handleThemeChange, handleDrawerChange } = useContext(AppContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ApBar
        position="static"
        sx={{ borderRadius: "0 0 2.1em 2.1em", padding: 0 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerChange}
            sx={[
              {
                marginRight: 5,
              },
              data.settings.isDrawerOpen && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Toolbar disableGutters>
            <LocalShippingIcon sx={{ display: "flex", mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: "flex",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".2rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              TripLog
            </Typography>
          </Toolbar>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
            <Tooltip
              title={data.settings.isDarkMode ? "Light mode" : "Dark mode"}
            >
              <IconButton
                size="large"
                color="inherit"
                onClick={handleThemeChange}
              >
                {data.settings.isDarkMode ? (
                  <LightModeIcon />
                ) : (
                  <DarkModeIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Help Questions">
              <IconButton size="large" color="inherit">
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </ApBar>
    </Box>
  );
}
