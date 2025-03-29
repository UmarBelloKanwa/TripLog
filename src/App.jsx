import * as React from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { useDemoRouter } from "@toolpad/core/internal";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AppProvider from "./contexts/AppContext";
import AppRoutes from "./AppRoutes";
import AppTitle from "./components/TriplogTitle";
import Toolbar from "./components/AppToolBar";
import SidebarFooter from "./components/SidebarFooter";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import CreateIcon from "@mui/icons-material/Create";
import MapIcon from "@mui/icons-material/Map";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import { Title } from "./components/TextField";
import theme from "./theme";

const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
};

export default function App() {
  const navigate = useNavigate();
  const router = useDemoRouter("/");
  const isMobile = useIsMobile();

  const navigateTo = (path, r = null) => {
    navigate(path);
    router.navigate(path);
    if (r !== null) {
      router.navigate(r);
    }
    if (isMobile) {
      document.querySelector("header .MuiButtonBase-root")?.click();
    }
  };

  return (
    <ReactRouterAppProvider
      branding={{
        logo: <LocalShippingIcon />,
        title: "TripLog",
        homeUrl: "/",
      }}
      navigation={[
        { kind: "header", title: "Create" },
        {
          segment: "create-trip",
          title: (
            <Title
              value="Create trip"
              Icon={AddBoxIcon}
              onClick={() => navigateTo("/create-trip")}
            />
          ),
          icon: <></>,
          children: [
            { kind: "header", title: "Via" },
            { segment: "form", title: "Form", icon: <FormatAlignLeftIcon /> },
            { segment: "text", title: "Text", icon: <CreateIcon /> },
          ],
        },
        { kind: "divider" },
        { kind: "header", title: "View" },
        {
          segment: "my-trip",
          title: (
            <Title
              value="My trip"
              Icon={ViewTimelineIcon}
              onClick={() => navigateTo("/my-trip")}
            />
          ),
          icon: <></>,
          children: [
            { kind: "header", title: "See" },
            { segment: "map", title: "Map", icon: <MapIcon /> },
            {
              segment: "eld-log",
              title: "ELD Log",
              icon: <CalendarViewWeekIcon />,
            },
          ],
        },
        { kind: "divider" },
      ]}
      router={router}
      theme={theme}
    >
      <AppProvider navigateTo={navigateTo} pathname={router.pathname}>
        <DashboardLayout
          disableCollapsibleSidebar
          slots={{
            appTitle: AppTitle,
            toolbarActions: Toolbar,
            sidebarFooter: SidebarFooter,
          }}
        >
          <AppRoutes />
        </DashboardLayout>
      </AppProvider>
    </ReactRouterAppProvider>
  );
}