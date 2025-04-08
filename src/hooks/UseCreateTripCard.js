import * as React from "react";
import api from "../services";

export default function useCreateTripCard(data) {
  const steps = [
    "Set current location",
    "Set pickup location",
    "Set dropoff location",
    "Set hours to spend",
  ];

  const [formData, setFormData] = React.useState(data);

  const [helperTexts, setHelperTexts] = React.useState({});

  const [activeStep, setActiveStep] = React.useState(0);

  const validateInput = (name, value) => {
    if (!value.trim()) {
      return "This field is required.";
    }

    switch (name) {
      case "current_location":
      case "pickup_location":
      case "dropoff_location":
        if (value.length < 3) {
          return "Location must be at least 3 characters long.";
        }
        if (!/^[a-zA-Z\s.,'-]+$/.test(value)) {
          return "Location must contain only letters, spaces, and common punctuation.";
        }
        break;
      case "hours":
        if (isNaN(value) || value <= 0) {
          return "Please enter a valid number of hours.";
        }
        if (value > 24) {
          return "Hours cannot exceed 24.";
        }
        break;
      default:
        return "";
    }

    return "";
  };

  const [completed, setCompleted] = React.useState(() => {
    // Initialize completed state based on the validity of the provided data
    return Object.keys(formData).reduce((acc, key, index) => {
      const isValid = !validateInput(key, data[key]); // Check if the input is valid
      if (isValid) {
        acc[index] = true; // Mark step as completed if valid
      }
      return acc;
    }, {});
  });

  const isStepFailed = (step) => {
    const key = Object.keys(formData)[step];
    return helperTexts[key];
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const currentDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const handleStep = (step) => () => {
    if (activeStep != step) {
      setActiveStep(step);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleSetFormData = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const validationMessage = validateInput(name, value);

    setHelperTexts((prev) => ({
      ...prev,
      [name]: validationMessage,
    }));

    if (validationMessage) {
      setCompleted((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const areInputsValid = React.useCallback(() => {
    const newHelperTexts = {};
    const newCompleted = {};
    let isValid = true;

    Object.keys(formData).forEach((key, index) => {
      const validationMessage = validateInput(key, formData[key]);
      newHelperTexts[key] = validationMessage;
      if (!validationMessage) {
        newCompleted[index] = true; // Mark step as completed if valid
      } else {
        isValid = false; // Mark as invalid if any input fails validation
      }
    });

    setHelperTexts(newHelperTexts); // Update helper texts
    setCompleted(newCompleted); // Update completed steps
    return isValid; // Return overall validity
  }, [formData]);

  React.useEffect(() => {
    areInputsValid(); // Revalidate inputs whenever formData changes
  }, [formData, areInputsValid]);

  const [loading, setLoading] = React.useState(false); // Add loading state

  const submitData = async () => {
    const isValid = areInputsValid(); // Ensure helperTexts is updated
    if (!isValid) {
      // If inputs are invalid, helperTexts will already be updated
      return;
    }

    setLoading(true); // Start loading
    setTimeout(() => {
      // Simulate a delay
      // Clear helperTexts and mark all steps as completed
      setHelperTexts({});
      setCompleted(
        Object.keys(formData).reduce((acc, key, index) => {
          acc[index] = true;
          return acc;
        }, {})
      );

      alert("Trip created successfully!");
      try {
        const d = api.createTrip(formData);
        api.storeTrip(d);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }, 3000); // 3-second delay
  };

  return {
    formData,
    handleSetFormData,
    helperTexts,
    submitData,
    currentDate,
    steps,
    allStepsCompleted,
    handleReset,
    activeStep,
    completed,
    handleStep,
    isStepFailed,
    loading, // Expose loading state
  };
}
