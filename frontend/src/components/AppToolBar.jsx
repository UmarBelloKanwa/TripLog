import * as React from "react";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AppContext from "../contexts/AppContextProvider";
import { ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import FAQ from "./FAQ";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function Toolbar() {
  const { handleThemeChange } = React.useContext(AppContext);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "faq-popover" : undefined;

  return (
    <>
      <Stack direction="row">
        <span onClick={handleThemeChange}>
          <ThemeSwitcher />
        </span>
        <Tooltip title="Help" enterDelay={1000}>
          <IconButton type="button" aria-label="Help" onClick={handleClick}>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <FAQ id={id} open={open} anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
}
