import * as React from "react";
import AppContext from "./contexts/AppContextProvider";
import { Outlet } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { useColorScheme } from "@mui/material/styles";
import SpeedDeal from "./components/SpeedDial";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import StyledBreadcrumb from "./components/StyledBreadcrumb";

export default function AppLayout() {
  const { data, pathname, route, navigateTo } = React.useContext(AppContext);
  const { setMode } = useColorScheme();

  const navigate = (r, p = null) => navigateTo(r, p, false);

  React.useEffect(() => {
    setMode(data.settings.isDarkMode ? "dark" : "light");
  }, [data.settings.isDarkMode, setMode]);

  return (
    <Paper
      sx={(theme) => ({
        my: 0,
        p: 2,
        height: "100vh",
        overflow: "auto",
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari
        },
        background:
          "linear-gradient(45deg,rgba(255, 255, 255, 0.84) 30%,rgba(45, 11, 112, 0.22) 90%, rgba(255, 255, 255, 0.42))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...theme.applyStyles("dark", {
          background:
            "linear-gradient(45deg,rgba(5, 10, 25, 0.47) 30%,rgba(108, 48, 229, 0.14) 90%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }),
        ...(route == "/" && {
          background:
            "linear-gradient(rgba(241, 237, 255, .5), rgba(241, 255, 255, 0.7)), url('/images/lightTruck.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          ...theme.applyStyles("dark", {
            background:
              "linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3)), url('/images/eveningTruck.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }),
        }),
      })}
    >
      <Container>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <StyledBreadcrumb
              component="a"
              onClick={() => navigate("/")}
              label="Home"
              icon={<HomeIcon fontSize="small" color="white" />}
            />
            {route === "/create-trip" && [
              <StyledBreadcrumb
                key="create-trip"
                component="a"
                label="Create trip"
                onClick={() => navigate("/create-trip")}
              />,
              (pathname === "/form" || pathname === "/create-trip/form") && (
                <StyledBreadcrumb
                  key="form"
                  component="a"
                  label="Form"
                  onClick={() => navigate("/create-trip", "form")}
                />
              ),
              (pathname === "/text" || pathname === "/create-trip/card") && (
                <StyledBreadcrumb
                  key="card"
                  component="a"
                  label="Card"
                  onClick={() => navigate("/create-trip", "card")}
                />
              ),
            ]}

            {route == "/my-trips" && [
              <StyledBreadcrumb
                component="a"
                label="My trips"
                onClick={() => navigate("/my-trips")}
              />,
              (pathname == "/last-created" ||
                pathname == "/my-trips/last-created") && (
                <StyledBreadcrumb
                  component="a"
                  label="Last created"
                  onClick={() => navigate("/my-trips/last-created")}
                />
              ),
              (pathname == "/all-trips" ||
                pathname == "/my-trips/all-trips") && (
                <StyledBreadcrumb
                  component="a"
                  label="All trips"
                  onClick={() => navigate("/my-trips/all-trips")}
                />
              ),
            ]}
          </Breadcrumbs>
        </div>
        <main>
          <Outlet />
        </main>
        <SpeedDeal />
      </Container>
    </Paper>
  );
}
