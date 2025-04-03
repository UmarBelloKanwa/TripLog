import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import DashedInput from "./DashedInput";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import UseCreateTripCard from "../hooks/UseCreateTripCard";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
      },
    },
  ],
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <PersonPinIcon />,
    2: <LocationCityIcon />,
    3: <FmdGoodIcon />,
    4: <QueryBuilderIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

export default function CreateTripCard({ data }) {
  const {
    formData,
    handleSetFormData,
    submitData,
    steps,
    currentDate,
    activeStep,
    completed,
    handleStep,
    isStepFailed,
    helperTexts, // Add helperTexts here
    loading, // Use loading state
  } = UseCreateTripCard(data); // Pass `data` to the hook

  const isButtonDisabled =
    !Object.keys(completed).length ||
    Object.values(helperTexts).some((text) => text) || // Use helperTexts here
    loading;
  // Disable button if no steps are completed, any helper text exists, or loading is true

  return (
    <Box
      sx={{
        textAlign: "left",
        width: {
          xs: "100%",
          sm: "83%",
        },
        m: "auto",
      }}
    >
      <div>
        <React.Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Card sx={{ borderRadius: 5 }}>
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe">
                    <Box
                      component="img"
                      src="/images/truck.jpg"
                      alt="Triplog Logo"
                      sx={{
                        width: {
                          xs: 70,
                          sm: 100,
                        },
                        height: {
                          xs: 50,
                          sm: 63,
                        },
                      }}
                    />
                  </Avatar>
                }
                action={
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                }
                title="Truck Driver"
                subheader={currentDate}
              />
              <CardMedia
                component="img"
                height="194"
                image="/images/eveningTruck.jpg"
                alt="Truck image"
              />
              <Stepper
                alternativeLabel
                activeStep={activeStep}
                connector={<ColorlibConnector />}
                sx={{ width: "90%", margin: "1em auto auto auto" }}
              >
                {steps.map((label, index) => {
                  const labelProps = {};
                  const helperText = isStepFailed(index);
                  if (helperText) {
                    labelProps.optional = (
                      <Typography variant="caption" color="error">
                        {helperText}
                      </Typography>
                    );

                    labelProps.error = true;
                  }
                  return (
                    <Step key={label} completed={completed[index]}>
                      <StepLabel
                        {...labelProps}
                        StepIconComponent={ColorlibStepIcon}
                        color="inherit"
                        onClick={handleStep(index)}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  About the trip
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Currently, I am at{" "}
                  <DashedInput
                    value={formData["current-location"]} // Prioritize form data
                    name="current-location"
                    onChange={(e) => handleSetFormData(e)}
                  />{" "}
                  , preparing to pick up goods from{" "}
                  <DashedInput
                    value={formData["pickup-location"]} // Prioritize form data
                    name="pickup-location"
                    onChange={(e) => handleSetFormData(e)}
                  />{" "}
                  and deliver them to{" "}
                  <DashedInput
                    value={formData["dropoff-location"]} // Prioritize form data
                    name="dropoff-location"
                    onChange={(e) => handleSetFormData(e)}
                  />
                  . The journey is expected to take approximately{" "}
                  <DashedInput
                    value={formData["hours"]}
                    type="number"
                    name="hours"
                    width="50px"
                    onChange={(e) => handleSetFormData(e)}
                  />{" "}
                  hours, ensuring safe and timely transportation while
                  maintaining efficiency on the route.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={submitData}
                  disabled={isButtonDisabled} // Disable button conditionally
                  endIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  } // Show loading spinner
                >
                  {loading ? "Creating..." : "Create"}{" "}
                  {/* Update button text */}
                </Button>
              </CardActions>
            </Card>
          </Box>
        </React.Fragment>
      </div>
    </Box>
  );
}
