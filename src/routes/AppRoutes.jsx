import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateTripPage from "../pages/CreateTripPage";
import MyTripPage from "../pages/MyTripPage";
import HomePage from "../pages/HomePage";
import AppLayout from "../layouts/AppLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/create-trip/*" element={<CreateTripPage />} />
        <Route path="/my-trips/*" element={<MyTripPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
