import React, { useState, useEffect } from "react";
import AppContext from "./AppContextProvider";

const AppProvider = ({ children }) => {
  const [data, setData] = useState({
    settings: {
      isDarkMode: false,
      isDrawerOpen: false,
    },
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("appData"));
    if (storedData) {
      setData(storedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("appData", JSON.stringify(data));
  }, [data]);

  const handleThemeChange = () => {
    setData((prevData) => ({
      ...prevData,
      settings: {
        ...prevData.settings,
        isDarkMode: !prevData.settings.isDarkMode,
      },
    }));
  };

  const handleDrawerChange = () => {
    setData((prevData) => ({
      ...prevData,
      settings: {
        ...prevData.settings,
        isDrawerOpen: !prevData.settings.isDrawerOpen,
      },
    }));
  };

  return (
    <AppContext.Provider
      value={{ data, handleThemeChange, handleDrawerChange }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;