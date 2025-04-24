import * as React from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
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
import PersonPinIcon from "@mui/icons-material/PersonPin";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import UseCreateTripCard from "../hooks/UseCreateTripCard";
import CircularProgress from "@mui/material/CircularProgress";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import useIsMobile from "../hooks/useIsMobile";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CancelIcon from "@mui/icons-material/Cancel";

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
    5: <DriveFileRenameOutlineIcon />,
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
    helperTexts,
    loading,
    errorFeedback,
    handleCloseErrorFeedback,
  } = UseCreateTripCard(data); // Pass `data` to the hook

  const isButtonDisabled =
    !Object.keys(completed).length ||
    Object.values(helperTexts).some((text) => text) || // Use helperTexts here
    loading;
  // Disable button if no steps are completed, any helper text exists, or loading is true

  const isMobile = useIsMobile();
  const navigate = useNavigate();

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
                  <IconButton
                    aria-label="share"
                    onClick={() => navigate("/create-trip/form")}
                  >
                    <CancelIcon />
                  </IconButton>
                }
                title="Mr. Driver"
                subheader={currentDate}
              />
              <CardMedia
                component="img"
                image="/images/eveningTruck.jpg"
                alt="Truck image"
                sx={{
                  height: {
                    xs: 200,
                    sm: 300,
                  },
                  width: "98.3%",
                  m: "auto",
                  borderRadius: 9,
                }}
              />
              <Stepper
                alternativeLabel
                activeStep={activeStep}
                connector={<ColorlibConnector />}
                sx={{ width: "100%", margin: "1em auto auto auto" }}
              >
                {steps.map((label, index) => {
                  if (isMobile && index === 0) {
                    return;
                  }
                  const labelProps = {};
                  const helperText = isStepFailed(index);
                  if (!isMobile && helperText) {
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
                <TextField
                  id="standard-textarea"
                  variant="standard"
                  multiline
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                    width: "50%",
                    backgroundColor: "transparent",
                    mb: 3,
                    mt: 2,
                    font: "100%",
                    fontSize: "17px",
                    fontWeight: "600",
                  })}
                  spellCheck={false}
                  placeholder="Trip Name..."
                  name="trip_name"
                  onChange={handleSetFormData}
                  value={formData["trip_name"]}
                  maxLength={30}
                  error={!!helperTexts["trip_name"]}
                  helperText={isMobile ? helperTexts["trip_name"] : null}
                />

                <Typography variant="body2" sx={{ textAlign: "justify" }}>
                  Currently, I am at{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {formData["current_location"]}
                  </span>
                  , preparing to pick up goods from{"  "}
                  <span style={{ fontWeight: "bold" }}>
                    {formData["pickup_location"]}{" "}
                  </span>
                  and deliver them to{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {formData["dropoff_location"]}.{" "}
                  </span>
                  The current cycle used (hours) is{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {formData["hours"]}{" "}
                  </span>
                  hours, ensuring safe and timely transportation while
                  maintaining efficiency on the route.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={async () => await submitData()}
                  className={!isButtonDisabled ? "Bty-button" : ""}
                  disabled={isButtonDisabled} // Disable button conditionally
                  endIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  } // Show loading spinner
                >
                  {loading ? "Creating..." : "Create"}
                </Button>
              </CardActions>
            </Card>
          </Box>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={!!errorFeedback}
            //autoHideDuration={6000}
            onClose={handleCloseErrorFeedback}
            sx={{ width: { xs: "85%", sm: "40%" } }}
          >
            <Alert
              onClose={handleCloseErrorFeedback}
              severity="error"
              variant="standard"
              elevation={2}
            >
              {errorFeedback}
            </Alert>
          </Snackbar>
        </React.Fragment>
      </div>
    </Box>
  );
}
