import * as React from "react";
import AppContext from "../contexts/AppContextProvider";
import Container from "@mui/material/Container";
import SpeedDeal from "../components/SpeedDial";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import AppTitle from "../components/TriplogTitle";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: (theme.vars || theme).palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(theme.palette.grey[100], 0.06),
      ...theme.applyStyles("dark", {
        backgroundColor: emphasize(theme.palette.grey[800], 0.06),
      }),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[100], 0.12),
      ...theme.applyStyles("dark", {
        backgroundColor: emphasize(theme.palette.grey[800], 0.12),
      }),
    },
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  };
});

const steps = [
  {
    label: "Enter Trip Details",
    description: `Start by providing your trip details, including your current location,
                  pickup location, and drop-off location. Make sure to also enter your 
                  available driving hours (cycle used) to ensure accurate log calculations.`,
  },
  {
    label: "View Route & Stops",
    description: `Once your trip details are entered, a map will be generated showing your 
                  planned route, including rest stops and fueling points based on your trip duration.`,
  },
  {
    label: "Track & Log Your Trip",
    description: `As you progress on your journey, update your log with actual stops, rest periods, 
                  and fuel stops. The system will generate and update your Daily Log Sheets 
                  for compliance and record-keeping.`,
  },
  {
    label: "Complete & Save Logs",
    description: `At the end of your trip, review your log sheets, make any necessary corrections, 
                  and save them for future reference. Ensure all details are accurate 
                  for compliance with travel regulations.`,
  },
];

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: "rgba(78, 88, 225, 0.1)",
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  }),
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
  backgroundColor: "transparent",
  flexDirection: "row-reverse",
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

export default function Home() {
   const { navigateTo } = React.useContext(AppContext);

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    navigateTo("/create-trip");
  };

  return (
    <Container
      sx={(theme) => ({
        my: 0,
        p: 2,
        height: "100vh",
        overflow: "auto",
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari
        },
        background:
          "linear-gradient(rgba(241, 237, 255, .5), rgba(241, 255, 255, .9)), url('/dayTruck.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...theme.applyStyles("dark", {
          background:
            "linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3)), url('/eveningTruck.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }),
      })}
    >
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <StyledBreadcrumb
            component="a"
            href="/"
            label="Home"
            icon={<HomeIcon fontSize="small" />}
          />
        </Breadcrumbs>
      </div>
      <Box
        sx={{
          textAlign: "center",
          width: {
            xs: "100%",
            sm: "77%",
          },
          margin: "0 auto",
          alignItems: "center",
          alignContent: "center",
          alignSelf: "center",
        }}
      >
        {" "}
        <Box
          sx={{
            width: "fit-content",
            m: "auto",
            textAlign: "center",
          }}
        >
          <AppTitle isLink={false} />
        </Box>
        <Typography variant="caption">
          - Simplifying Your Journey, One Log at a Time!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            margin: "auto",
            mt: 2,
            color: "text.primary",
            fontStyle: "monospace",
            letterSpacing: {
              xs: "1px",
              sm: ".1rem",
            },
            fontSize: {
              xs: "small",
            },
            fontWeight: {
              xs: "50",
            },
          }}
        >
          Planning a trip has never been easier! <strong>TripLog</strong> is
          your ultimate trip tracking and logging solution, designed for
          professional, truck drivers and logistics teams. Enter your trip
          details, and let TripLog handle the rest—generating optimized routes,
          tracking stops and fuel points, and auto-filling your{" "}
          <strong>Electronic Logging Device (ELD) logs</strong> for compliance.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    index === steps.length - 1 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent TransitionProps={{ unmountOnExit: false }}>
                  <Typography>{step.description}</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? "Finish" : "Continue"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Box sx={{ p: 1 }}>
              <Typography>
                All steps completed - you&apos;re finished
              </Typography>

              <Button
                variant="contained"
                onClick={handleReset}
                sx={{ mt: 1, mr: 1 }}
              >
                Get started your trip
              </Button>
            </Box>
          )}
        </Box>
        <Divider sx={{ mt: 1, mb: 1 }}>
          <Chip label="What we offered ?" variant="contained" />
        </Divider>
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "70%",
            },
            m: "auto",
          }}
        >
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography
                component="span"
                sx={{ width: "fitcontent", m: "auto" }}
              >
                Smart Trip Logging
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                – Input your pickup, drop-off, and driving hours with ease.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography
                component="span"
                sx={{ width: "fitcontent", m: "auto" }}
              >
                Interactive Route Maps
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Visualize your journey with a{" "}
                <strong>real-time route planner</strong>.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography
                component="span"
                sx={{ width: "fitcontent", m: "auto" }}
              >
                ELD Log Sheets
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Automatically generate daily logs for compliance and
                record-keeping.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography
                component="span"
                sx={{ width: "fitcontent", m: "auto" }}
              >
                Seamless User Experience
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                A clean and intuitive interface designed for efficiency.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Typography
            variant="subtitle2"
            sx={{
              mt: 7,
              fontStyle: "italic",
              fontWeight: "100",
              letterSpacing: "1px",
              color: "inherit",
            }}
          >
            Whether you're a long-haul trucker or a logistics company,{" "}
            <strong>TripLog</strong> keeps your trips organized, compliant, and
            stress-free!
          </Typography>
          <br />
          <Divider>
            <Chip
              label="Get started by clicking over + icon"
              variant="outlined"
            />
          </Divider>
        </Box>
      </Box>
      <SpeedDeal />
    </Container>
  );
}
