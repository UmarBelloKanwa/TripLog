import * as React from "react";
import CreateTripForm from "../components/CreateTripForm";
import CreateTripCard from "../components/CreateTripCard";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";

const CreateTrip = () => {
  const [tripData, setTripData] = React.useState({});

  const { pathname } = useLocation();

  let isForm =
    pathname == "/create-trip" ||
    pathname == "/form" ||
    pathname == "/create-trip/form" ||
    pathname == "/";
  const [step, setStep] = React.useState(isForm ? "form" : "card");

  isForm = isForm && step == "form";

  return (
    <Box
      sx={{
        textAlign: "center",
        m: "auto",
      }}
    >
      <Typography
        variant="h4"
        textAlign="left"
        sx={{ width: "fit-content", m: 0, mt: 0.7, mb: 0.5 }}
      >
        Create new trip
      </Typography>
      {isForm && (
        <CreateTripForm
          nextStep={(data) => {
            setTripData(data); // Ensure tripData is updated with form data
            setStep("card");
          }}
        />
      )}
      {(pathname == "/create-trip/card" ||
        pathname == "/card" ||
        step == "card") && (
        <CreateTripCard data={tripData} /> // Pass tripData to CreateTripCard
      )}
    </Box>
  );
};

export default CreateTrip;
