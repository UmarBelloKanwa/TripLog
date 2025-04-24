import * as React from "react";
import api from "../services";

export default function useCreateTripForm(data) {
  const [formData, setFormData] = React.useState(data);
  const [helperTexts, setHelperTexts] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const [currentLocationPlaceholder, setCurrentLocationPlaceholder] =
    React.useState("Where you are now");
  const [pickupLocationPlaceholder, setPickupLocationPlaceholder] =
    React.useState("Pickup location");
  const [dropoffLocationPlaceholder, setDropoffLocationPlaceholder] =
    React.useState("Dropoff location");

  React.useEffect(() => {
    const fetchCurrentLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const results = await api.reverseGeocode(latitude, longitude);
              if (results.length > 0) {
                setCurrentLocationPlaceholder(results[0].label);

                // Extract the country from the reverse geocode results
                const country = results[0].label.split(",").pop().trim();

                // Fetch two popular locations in the user's country
                const countryLocations = await api.fetchLocations(country);
                if (countryLocations.length >= 2) {
                  setPickupLocationPlaceholder(countryLocations[0].label);
                  setDropoffLocationPlaceholder(countryLocations[1].label);
                }
              }
            } catch /*(error)*/ {
              //console.warn("Error fetching current location or country locations:", error);
            }
          },
          (/*error*/) => {
            //console.warn("Geolocation error:", error);
          }
        );
      }
    };

    fetchCurrentLocation();
  }, []);

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
      case "pickup_location":
      case "dropoff-location":
        if (value.length < 3) {
          return "Location must be at least 3 characters long.";
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
        if (key != "trip_name") {
          isValid = false;
        }
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
    currentLocationPlaceholder,
    pickupLocationPlaceholder,
    dropoffLocationPlaceholder,
  };
}
