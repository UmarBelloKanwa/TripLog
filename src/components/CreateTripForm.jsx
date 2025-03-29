import * as React from "react";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "./TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
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

export default function CreateTrip() {
  const loading = false;

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
      >
        <Alert severity="error">
          <AlertTitle> Form Error </AlertTitle>
          Err
        </Alert>

        <TextField
          value={""}
          error={!!""}
          helperText={""}
          id="current-location"
          type="text"
          name="current-location"
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
          value={""}
          error={!!""}
          helperText={""}
          id="pickup-location"
          type="text"
          name="pickup-location"
          label="Pickup location"
          placeholder="Pickup location"
          autoComplete="pickup-location"
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
          value={""}
          error={!!""}
          helperText={""}
          id="dropup-location"
          type="text"
          name="dropoff-location"
          label="Dropoff location"
          placeholder="Dropoff location"
          autoComplete="dropoff-location"
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
          value={""}
          error={!!""}
          helperText={""}
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
          disabled={loading}
        >
          Create
        </Button>
      </Box>
    </Card>
  );
}
