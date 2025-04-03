import * as React from "react";

export default function useCreateTripForm() {
  const main = {
    "current-location": "",
    "pickup-location": "",
    "dropoff-location": "",
    hours: "", // Current Cycle Used (Hrs)
  };
  const [formData, setFormData] = React.useState({
    "current-location": "Sokoto",
    "pickup-location": "Zamfara",
    "dropoff-location": "Kano",
    hours: "12", // Current Cycle Used (Hrs)
  });

  const [helperTexts, setHelperTexts] = React.useState(main);

  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const handleSetFormData = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setHelperTexts((prev) => ({
      ...prev,
      [e.target.name]: validateInput(e.target.name, e.target.value),
    }));
  };

  const validateInput = (name, value) => {
    if (!value.trim()) {
      return "This field is required.";
    }

    switch (name) {
      case "current-location":
      case "pickup-location":
      case "dropoff-location":
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

  const areInputsValid = React.useCallback(() => {
    const newHelperTexts = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const validationMessage = validateInput(key, formData[key]);
      newHelperTexts[key] = validationMessage;
      if (validationMessage) {
        isValid = false;
      }
    });
    return { isValid, newHelperTexts };
  }, [formData]);

  React.useEffect(() => {
    const { isValid } = areInputsValid(); // Destructure `isValid` correctly
    setDisabled(!isValid); // Set `disabled` based on `isValid`
  }, [formData, areInputsValid]); // Ensure `formData` is included in dependencies

  const goToNextStep = (nextStep) => {
    setLoading(true);
    const { isValid, newHelperTexts } = areInputsValid(); // Correctly destructure `isValid` and `newHelperTexts`

    setHelperTexts(newHelperTexts);

    if (isValid) {
      // Introduce a delay before proceeding to the next step
      setTimeout(() => {
        nextStep(formData);
        setLoading(false); // Stop loading after the delay
      }, 3000); // 3-second delay
    } else {
      setLoading(false); // Stop loading immediately if inputs are invalid
    }
  };

  return {
    formData,
    handleSetFormData,
    helperTexts,
    goToNextStep,
    loading,
    disabled,
  };
}
