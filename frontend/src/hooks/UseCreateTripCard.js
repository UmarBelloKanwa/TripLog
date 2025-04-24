import * as React from "react";
import api from "../services";
import { db } from "../models/db";

import { useNavigate } from "react-router-dom";

export default function useCreateTripCard(data) {
  const steps = [
    "Current location",
    "Pickup location",
    "Dropoff location",
    "Hours to spend",
    "Trip name",
  ];

  const navigate = useNavigate();
  const [formData, setFormData] = React.useState(data);
  const [helperTexts, setHelperTexts] = React.useState({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [errorFeedback, setErrorFeedback] = React.useState(null);

  const validateInput = (name, value) => {
    if (!String(value).trim()) {
      return "This field is required.";
    }
    let n = name != "trip_name" ? "Location" : "Trip name";
    switch (name) {
      case "current_location":
      case "pickup_location":
      case "dropoff_location":
      case "trip_name":
        if (value.length < 3) {
          return `${n} must be at least 3 characters long.`;
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
    return Object.keys(formData).reduce((acc, key, index) => {
      const isValid = !validateInput(key, data[key]);
      if (isValid) {
        acc[index] = true;
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
    const keys = Object.keys(formData);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const validationMessage = validateInput(key, formData[key]);
      newHelperTexts[key] = validationMessage;
      if (!validationMessage) {
        newCompleted[i] = true;
      } else {
        isValid = false;
        if (key !== "trip_name") {
          navigate("/create-trip/form"); // Only runs once
        }
        break;
      }
    }

    setHelperTexts(newHelperTexts);
    setCompleted(newCompleted);
    return isValid;
  }, [formData, navigate]);

  React.useEffect(() => {
    areInputsValid(); // Revalidate inputs whenever formData changes
  }, [formData, areInputsValid]);

  const submitData = async () => {
    if (!areInputsValid()) {
      return;
    }

    setLoading(true);
    setHelperTexts({});

    const existedName = await db.trips
      .where("trip_name")
      .equalsIgnoreCase(formData.trip_name)
      .first();

    if (existedName) {
      setHelperTexts((pr) => ({
        ...pr,
        trip_name: "Trip name is already existed, use another name",
      }));
      setLoading(false);
      return;
    }

    setLoading(true);
    setHelperTexts({});
    setCompleted(
      Object.keys(formData).reduce((acc, key, index) => {
        acc[index] = true;
        return acc;
      }, {})
    );

    try {
      const response = await api.createTrip(formData);
      const data = await response.json();

      console.log("response data", data);
      if (response.ok) {
        try {
          const id = db.trips.add({
            ...formData,
            created_at: new Date().toISOString(),
          });
          if (id) navigate("/my-trips/last-created");
        } catch (err) {
          setErrorFeedback(`Failed to store ${formData.trip_name} : ${err}`);
        }
      } else {
        setErrorFeedback(`An unexpected error occured, ${data?.message}`);
      }
    } catch /*(err)*/ {
      setErrorFeedback(
        `An unexpected error occured, Failed to Fetch, Please try again!!!`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorFeedback = () => {
    setErrorFeedback(null);
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
    loading,
    errorFeedback,
    handleCloseErrorFeedback,
  };
}
