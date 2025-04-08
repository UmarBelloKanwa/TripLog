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
        <TextField
          value={formData["current_location"]}
          error={!!helperTexts["current_location"]}
          helperText={helperTexts["current_location"]}
          onChange={handleSetFormData}
          id="current_location"
          type="text"
          name="current_location"
          label="Current loaction"
          placeholder="Where you are now"
          autoComplete="loacation"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonPinIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          value={formData["pickup_location"]}
          error={!!helperTexts["pickup_location"]}
          helperText={helperTexts["pickup_location"]}
          onChange={handleSetFormData}
          id="pickup_location"
          type="text"
          name="pickup_location"
          label="Pickup location"
          placeholder="Pickup location"
          autoComplete="pickup_location"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCityIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          value={formData["dropoff_location"]}
          error={!!helperTexts["dropoff_location"]}
          helperText={helperTexts["dropoff_location"]}
          onChange={handleSetFormData}
          id="dropup-location"
          type="text"
          name="dropoff_location"
          label="Dropoff location"
          placeholder="Dropoff location"
          autoComplete="dropoff_location"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
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
          id="hours"
          type="texts"
          name="hours"
          label="Current Cycle Used Hours"
          placeholder="Current Cycle Used (Hrs)"
          autoComplete="hours"
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
