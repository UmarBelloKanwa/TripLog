import * as React from "react";
import CreateTripForm from "../components/CreateTripForm";
import CreateTripCard from "../components/CreateTripCard";
import Box from "@mui/material/Box";
import { useNavigate, Routes, Route } from "react-router-dom";

const CreateTrip = () => {
  const [tripData, setTripData] = React.useState({
    current_location: "", // New York, NY, USA
    pickup_location: "", // Chicago, IL, USA
    dropoff_location: "", // Dallas, TX, USA
    hours: "", // Current driving time spent before the trip (can be used to calculate required rest or breaks
    trip_name: "", // Demo Trip
  });

  const navigate = useNavigate();

  const Form = () => (
    <CreateTripForm
      data={tripData}
      nextStep={(data) => {
        setTripData(data);
        navigate("/create-trip/card");
      }}
    />
  );

  return (
    <Box sx={{ textAlign: "center", m: "auto" }}>
      <h1 style={{ textAlign: "left", marginTop: 13.5, marginBottom: 13 }}>
        Create Trip
      </h1>
      <Routes>
        <Route index element={<Form />} />
        <Route path="form" element={<Form />} />
        <Route path="*" element={<Form />} />
        <Route path="card" element={<CreateTripCard data={tripData} />} />
      </Routes>
    </Box>
  );
};

export default CreateTrip;
