import * as React from "react";
import Container from "@mui/material/Container";
import CreateTrip from "../components/CreateTrip";
import CreateTripText from "../components/CreateTripText";
import SpeedDeal from "../components/SpeedDial";
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CreateIcon from "@mui/icons-material/Create";
import AddBoxIcon from "@mui/icons-material/AddBox";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: (theme.vars || theme).palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(theme.palette.grey[100], 0.06),
      ...theme.applyStyles('dark', {
        backgroundColor: emphasize(theme.palette.grey[800], 0.06),
      }),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[100], 0.12),
      ...theme.applyStyles('dark', {
        backgroundColor: emphasize(theme.palette.grey[800], 0.12),
      }),
    },
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  };
});

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}


const CreateTripLayout = ({ pathname}) => {
  console.log(pathname)
  return (
    <Container sx={{ my: 2 }}>
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          <StyledBreadcrumb
            component="a"
            href="#"
            label="Home"
            icon={<HomeIcon fontSize="small" />}
          />
        </Breadcrumbs>
      </div>
      {pathname == "/create-trip/form" && <CreateTrip />}
      {pathname == "/create-trip/text" && <CreateTripText />}
      <SpeedDeal />
    </Container>
  );
};

export default CreateTripLayout;