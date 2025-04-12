import * as React from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import AppProvider from "./contexts/AppContext";
import AppRoutes from "./routes/AppRoutes";
import AppTitle from "./components/AppTitle";
import Toolbar from "./components/AppToolBar";
import SidebarFooter from "./components/SidebarFooter";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import { Title } from "./components/AppTitle";
import theme from "./theme";
import { useLocation, useNavigate } from "react-router-dom";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import useIsMobile from "./hooks/useIsMobile";

export default function App() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();

  const navigateTo = (route, isFromMenu = true) => {
    if (route != location.pathname) {
      navigate(route);
    }

    if (isMobile && isFromMenu) {
      document.querySelector("header .MuiButtonBase-root")?.click();
    }
  };

  return (
    <ReactRouterAppProvider
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
            {
              segment: "last-created",
              title: (
                <Title
                  value="Last created"
                  Icon={HistoryEduIcon}
                  onClick={() => navigateTo("/my-trips/last-created")}
                />
              ),
              icon: <></>,
            },
            {
              segment: "all-trips",
              title: (
                <Title
                  value="All trips"
                  Icon={AlignHorizontalLeftIcon}
                  onClick={() => navigateTo("/my-trips/all-trips")}
                />
              ),
              icon: <></>,
            },
          ],
        },
        { kind: "divider" },
      ]}
      theme={theme}
    >
      <AppProvider navigateTo={navigateTo}>
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
