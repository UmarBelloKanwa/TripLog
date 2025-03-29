import React from "react";
import AppContext from "./contexts/AppContextProvider";
import { Routes, Route } from "react-router-dom";
import CreateTripLayout from "./layouts/CreateTripLayout";
import MyTripLayout from "./layouts/MyTripLayout";
import Home from "./layouts/Home";
import Paper from "@mui/material/Paper";
import { useColorScheme } from "@mui/material/styles";

const AppRoutes = () => {
  const { data } = React.useContext(AppContext);
  const { setMode } = useColorScheme();

  React.useEffect(() => {
    setMode(data.settings.isDarkMode ? "dark" : "light"); 
  }, [data.settings.isDarkMode, setMode]);

  return (
    <Paper sx={{ width: "100%", minHeight: "100vh" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-trip" element={<CreateTripLayout />} />
        <Route path="/my-trip" element={<MyTripLayout />} />
      </Routes>
    </Paper>
  );
};

export default AppRoutes;
