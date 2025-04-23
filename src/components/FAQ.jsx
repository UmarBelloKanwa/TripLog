import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import AddIcon from "@mui/icons-material/Add";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
  "&:hover": {
    boxShadow: theme.shadows[2],
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export default function FAQ(props) {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Popover
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    >
      <Box
        elevation={3}
        sx={{
          width: 300,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontWeight: "100",
          }}
          fontSize="17px"
        >
          Frequently Asked Questions
        </Typography>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            indicator={<AddIcon />}
          >
            <Typography component="span" fontSize="14px">
              How do I create a trip?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography fontSize="14px">
              To create a trip, navigate to the "Create Trip" section, enter
              your trip details such as pickup and drop-off locations, and
              specify your driving hours. The app will generate a route and
              calculate stops automatically.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            aria-controls="panel2d-content"
            id="panel2d-header"
            indicator={<AddIcon />}
          >
            <Typography component="span" fontSize="14px">
              How does the app track my journey?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography fontSize="14px">
              The app uses your input to track your journey. You can update your
              stops, rest periods, and fuel points during the trip. The system
              will automatically update your log sheets for compliance.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            aria-controls="panel3d-content"
            id="panel3d-header"
            indicator={<AddIcon />}
          >
            <Typography component="span" fontSize="14px">
              How do I save and review my logs?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography fontSize="14px">
              At the end of your trip, you can review your log sheets in the "My
              Trip" section. Make any necessary corrections and save them for
              future reference. The logs are designed to comply with travel
              regulations.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Popover>
  );
}
