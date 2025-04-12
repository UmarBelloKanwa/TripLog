import * as React from "react";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "./TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import useCreateTripForm from "../hooks/useCreateTripForm";
import CircularProgress from "@mui/material/CircularProgress";
import LocationInput from "./LocationInput";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "fit-content",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(2, 3),
  gap: theme.spacing(2),
  margin: "0 auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  border: "none",
  borderRadius: 50,
  backgroundColor: "transparent",
}));

export default function CreateTripForm({ data, nextStep }) {
  const {
    formData,
    handleSetFormData,
    helperTexts,
    goToNextStep,
    loading,
    disabled,
    currentLocationPlaceholder,
    pickupLocationPlaceholder,
    dropoffLocationPlaceholder
  } = useCreateTripForm(data);

  

  return (
    <Card>
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
          m: "auto",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          goToNextStep(nextStep);
        }}
      >
        <LocationInput
          value={formData["current_location"]}
          error={!!helperTexts["current_location"]}
          helperText={helperTexts["current_location"]}
          onChange={handleSetFormData}
          name="current_location"
          label="Current Location"
          placeholder={currentLocationPlaceholder} // Dynamic placeholder
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonPinIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <LocationInput
          value={formData["pickup_location"]}
          error={!!helperTexts["pickup_location"]}
          helperText={helperTexts["pickup_location"]}
          onChange={handleSetFormData}
          name="pickup_location"
          label="Pickup Location"
          placeholder={pickupLocationPlaceholder} // Dynamic placeholder
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCityIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <LocationInput
          value={formData["dropoff_location"]}
          error={!!helperTexts["dropoff_location"]}
          helperText={helperTexts["dropoff_location"]}
          onChange={handleSetFormData}
          name="dropoff_location"
          label="Dropoff Location"
          placeholder={dropoffLocationPlaceholder} // Dynamic placeholder
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FmdGoodIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          value={formData["hours"]}
          error={!!helperTexts["hours"]}
          helperText={helperTexts["hours"]}
          onChange={handleSetFormData}
          name="hours"
          label="Current Cycle Used Hours"
          placeholder="Current Cycle Used (Hrs)"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <QueryBuilderIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            width: "50%",
            margin: "auto",
            borderRadius: 2,
          }}
          endIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
          disabled={disabled || loading}
        >
          Continue
        </Button>
      </Box>
    </Card>
  );
}
