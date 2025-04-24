import React, { useState, useEffect } from "react";
import AppContext from "./AppContextProvider";

const AppProvider = ({ children, navigateTo }) => {
  const [data, setData] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem("appData"));
    return (
      storedData || {
        settings: {
          isDarkMode: false,
        },
      }
    );
  });

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

  return (
    <AppContext.Provider value={{ data, handleThemeChange, navigateTo }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
