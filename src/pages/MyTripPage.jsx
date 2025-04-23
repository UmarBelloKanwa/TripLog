import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Trip from "../components/Trip";
import AllTrips from "../components/AllTrips";

const MyTrip = () => {
  return (
    <Routes>
      <Route index element={<AllTrips />} />
      <Route path="last-created" element={<Trip />} />
      <Route path="all-trips" element={<AllTrips />} />
      <Route path=":tripSlug" element={<Trip />} />
      <Route path="*" element={<AllTrips />} />
    </Routes>
  );
};

export default MyTrip;
