import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";

export default function NormalStepper({
  steps = [
    {
      label: "Step 1",
      description: "Step 1 description",
    },
    { label: "Step 2", description: "Step 2 description" },
    { label: "Step 3", description: "Step 3 description" },
  ],
  title = "step",
  completedText = "All steps completed - you're finished",
  nextAction = {
    text: "Reset",
    onClick: () => {},
  },
}) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <Box sx={{ mt: 3 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last {title}</Typography>
                ) : null
              }
            >
              <h3 style={{ margin: 0 }}> {step.label} </h3>
            </StepLabel>
            <StepContent TransitionProps={{ unmountOnExit: false }}>
              <Typography
                variant="subtitle1"
                sx={(theme) => ({
                  backgroundImage:
                    "linear-gradient(45deg,rgb(4, 13, 60) 30%,rgb(175, 87, 87) 90%,rgb(18, 48, 40))",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  ...theme.applyStyles("dark", {
                    backgroundImage:
                      "linear-gradient(45deg,rgb(54, 82, 169) 30%,rgb(255, 255, 255) 90%,rgb(54, 82, 169))",
                  }),
                })}
              >
                {step.description}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  className="Bty-button"
                  sx={{ mt: 1, mr: 1 }}
                >
                  {index === steps.length - 1 ? "Finish" : "Continue"}
                </Button>
                {index !== 0 && (
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Box sx={{ p: 1 }}>
          <Typography> {completedText} </Typography>

          <Button
            variant="contained"
            className="Bty-button"
            onClick={() => {
              handleReset();
              nextAction.onClick();
            }}
            sx={{ mt: 1, mr: 1 }}
          >
            {nextAction.text}
          </Button>
        </Box>
      )}
    </Box>
  );
}
