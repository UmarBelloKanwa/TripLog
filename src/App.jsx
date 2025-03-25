import React, { useContext } from "react";
import theme from "./theme";
import AppProvider from "./contexts/AppContext";
import AppContext from "./contexts/AppContextProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import AppTitle from "./components/AppTitle";
import Toolbar from "./components/AppToolBar";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SidebarFooter from "./components/SidebarFooter";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MapIcon from "@mui/icons-material/Map";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import CreateIcon from "@mui/icons-material/Create";
import { useColorScheme } from "@mui/material/styles";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import Paper from "@mui/material/Paper";
import { Title } from "./components/TextField";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";

const CREATE_TRIP_NAVIGATION = [
  {
    kind: "header",
    title: "Via",
  },
  {
    segment: "form",
    title: "Form",
    icon: <FormatAlignLeftIcon />,
  },
  {
    segment: "text",
    title: "Text",
    icon: <CreateIcon />,
  },
];

const VIEW_TRIP_NAVIGATION = [
  {
    kind: "header",
    title: "See",
  },
  {
    segment: "map",
    title: "Map",
    icon: <MapIcon />,
  },
  {
    segment: "eld-log",
    title: "ELD Log",
    icon: <CalendarViewWeekIcon />,
  },
];

function App() {
  const { data } = useContext(AppContext);
  const { setMode } = useColorScheme();

  const handleThemeChange = React.useCallback(
    (value) => {
      setMode(value);
    },
    [setMode]
  );

  handleThemeChange(data.settings.isDarkMode ? "dark" : "light");

  const navigate = useNavigate();
  const router = useDemoRouter("/");  

  return (
    <ReactRouterAppProvider
      branding={{
        logo: <LocalShippingIcon />,
        title: "TripLog",
        homeUrl: "/",
      }}
      navigation={[
        {
          kind: "header",
          title: "Create",
        },
        {
          segment: "create-trip",
          title: (
            <Title value="Create trip" Icon={AddBoxIcon} onClick={() => navigate("/create-trip")} />
          ),
          icon: <></>,
          children: CREATE_TRIP_NAVIGATION,
        },
        { kind: "divider" },
        {
          kind: "header",
          title: "View",
        },
        {
          segment: "my-trip",
          title: (
            <Title value="My trip" Icon={ViewTimelineIcon} onClick={() => navigate("/my-trip")} />
          ),
          icon: <></>,
          children: VIEW_TRIP_NAVIGATION,
        },
        { kind: "divider" },
      ]}
      router={router}
      theme={theme}
    >
      <DashboardLayout
        disableCollapsibleSidebar
        slots={{
          appTitle: AppTitle,
          toolbarActions: Toolbar,
          sidebarFooter: SidebarFooter,
        }}
      >
        <Paper sx={{ width: "100%", height: "100vh", maxHeight: "100%" }}>
          <AppRoutes />
        </Paper>
      </DashboardLayout>
    </ReactRouterAppProvider>
  );
}

const AppWrapper = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default AppWrapper;