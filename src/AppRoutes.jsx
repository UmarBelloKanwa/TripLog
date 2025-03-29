import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateTrip from "./pages/CreateTrip";
import MyTrip from "./pages/MyTrip";
import Home from "./pages/Home";
import AppLayout from "./AppLayout.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/my-trips" element={<MyTrip />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
