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
import { useLocation } from "react-router-dom";

const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
};

export default function App() {
  const navigate = useNavigate();
  const router = useDemoRouter("/");
  const isMobile = useIsMobile();
  const location = useLocation();


  const navigateTo = (route, path = null, isFromMenu = true) => {
    if (route != location.pathname) {
      navigate(route);
      router.navigate(route);
    }
    if (path !== null && path != router.pathname) {
      router.navigate(path);
    }
    if (isMobile && isFromMenu) {
      document.querySelector("header .MuiButtonBase-root")?.click();
    }
  };

  return (
    <ReactRouterAppProvider
      branding={{
        logo: <LocalShippingIcon />,
        title: "Triplog",
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
            { segment: "card", title: "Card", icon: <CreateIcon /> },
          ],
        },
        { kind: "divider" },
        { kind: "header", title: "View" },
        {
          segment: "my-trips",
          title: (
            <Title
              value="My trips"
              Icon={ViewTimelineIcon}
              onClick={() => navigateTo("/my-trips")}
            />
          ),
          icon: <></>,
          children: [
            { kind: "header", title: "See" },
            { segment: "last-created", title: "Last created", icon: <MapIcon /> },
            {
              segment: "all-trips",
              title: "All trips",
              icon: <CalendarViewWeekIcon />,
            },
          ],
        },
        { kind: "divider" },
      ]}
      router={router}
      theme={theme}
    >
      <AppProvider navigateTo={navigateTo} route={location.pathname} pathname={router.pathname}>
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
