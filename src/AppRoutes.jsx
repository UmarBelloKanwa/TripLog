import React from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import CreateTripLayout from "./layouts/CreateTripLayout";
import MyTripLayout from "./layouts/MyTripLayout";
import CreateTrip from "./components/CreateTrip";
import CreateTripText from "./components/CreateTripText";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Root Page */}
        <Route path="/" element={<CreateTripLayout />} />

        {/* Nested Route for Create Trip */}
        <Route path="/create-trip/*" element={<CreateTripLayout />}>
          <Route index element={<CreateTrip />} />
          <Route path="form" element={<CreateTrip />} />
          <Route path="text" element={<CreateTripText />} />
        </Route>

        {/* Nested Route for My Trip 
        <Route path="/my-trip//*" element={<PageContainer pathname="/my-trip" />}>
          <Route path="map" element={<div>Map Page</div>} /> /* /my-trip/map 
          <Route path="eld-logs" element={<div>ELD Logs Page</div>} /> /* /my-trip/eld-logs 
        </Route> */}
      </Routes>
    </>
  );
};

export default AppRoutes;