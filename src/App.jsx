import * as React from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AppProvider from "./contexts/AppContext";
import AppRoutes from "./routes/AppRoutes";
import AppTitle from "./components/TriplogTitle";
import Toolbar from "./components/AppToolBar";
import SidebarFooter from "./components/SidebarFooter";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import CreateIcon from "@mui/icons-material/Create";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import { Title } from "./components/TextField";
import theme from "./theme";
import { useLocation } from "react-router-dom";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";

const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
};

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
          children: [
            { kind: "header", title: "Via" },
            {
              segment: "form",
              title: (
                <Title
                  value="Form"
                  Icon={FormatAlignLeftIcon}
                  onClick={() => navigateTo("/create-trip/form")}
                />
              ),
              icon: <></>,
            },
            {
              segment: "card",
              title: (
                <Title
                  value="Card"
                  Icon={CreateIcon}
                  onClick={() => navigateTo("/create-trip/card")}
                />
              ),
              icon: <></>,
            },
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
