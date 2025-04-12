import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "./TextField";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../services";

const LocationInput = ({ onChange, ...props }) => {
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [userCountry, setUserCountry] = React.useState("");

  React.useEffect(() => {
    const fetchUserCountry = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const results = await api.reverseGeocode(latitude, longitude);
              if (results.length > 0) {
                const country = results[0].label.split(",").pop().trim();
                setUserCountry(country);
              }
            } catch /*(error)*/ {
              //console.error("Error fetching user's country:", error);
            }
          },
          (/*error*/) => {
            //console.error("Geolocation error:", error);
          }
        );
      }
    };

    fetchUserCountry();
  }, []);

  const handleInputChange = async (event, value) => {
    setLoading(true);
    try {
      const globalResults = await api.fetchLocations(value);

      // Prioritize results containing the user's country name
      const prioritizedResults = userCountry
        ? [
            ...globalResults.filter((result) =>
              result.label.includes(userCountry)
            ),
            ...globalResults.filter(
              (result) => !result.label.includes(userCountry)
            ),
          ]
        : globalResults;

      // Ensure unique keys by appending coordinates to the label
      const uniqueResults = prioritizedResults.map((result, index) => ({
        ...result,
        key: `${result.label}-${result.lat}-${result.lon}-${index}`,
      }));

      setOptions(uniqueResults);
    } catch /*(error)*/ {
      //console.error("Error fetching location options:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      freeSolo
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      loading={loading}
      onInputChange={handleInputChange}
      onChange={(event, value) => {
        onChange({
          target: {
            name: props.name,
            value: value?.label || "",
          },
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...props}
          needToClear={false}
          slotProps={{
            inputLabel: { shrink: true },
            ...props.slotProps,
            input: {
              ...params.InputProps,
              ...props.slotProps.input,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment || null}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default LocationInput;
