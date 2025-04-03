import * as React from "react";
import AppContext from "../contexts/AppContextProvider";
import { Outlet } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { useColorScheme } from "@mui/material/styles";
import SpeedDeal from "../components/SpeedDial";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import StyledBreadcrumb from "../components/StyledBreadcrumb";
import { useLocation, Link } from "react-router-dom";

export default function AppLayout() {
  const { data } = React.useContext(AppContext);

  const location = useLocation();
  const [route, pathname] = location.pathname
    .split("/")
    .filter((segment) => segment);
  const { setMode } = useColorScheme();

  React.useEffect(() => {
    setMode(data.settings.isDarkMode ? "dark" : "light");
  }, [data.settings.isDarkMode, setMode]);

  console.log("route", route, "path", pathname);

  return (
    <Paper
      sx={(theme) => ({
        my: 0,
        pt: 2,
        pb: 3,
        height: "100vh",
        overflow: "auto",
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari
        },
        background:
          "linear-gradient(45deg, rgb(241, 237, 255) 90%, rgba(255, 255, 255, 0.4))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...theme.applyStyles("dark", {
          background:
            "linear-gradient(45deg,#050a19 30%,rgba(108, 48, 229, 0.1) 90%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }),
        ...(location.pathname == "/" && {
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
            <Link to="/">
              <StyledBreadcrumb
                key="home"
                component="span"
                label="Home"
                icon={<HomeIcon fontSize="small" color="white" />}
              />
            </Link>
            {route === "create-trip" && [
              <Link to="/create-trip" key="create-trip">
                <StyledBreadcrumb component="span" label="Create trip" />
              </Link>,
              (pathname === "form" || pathname === "create-trip/form") && (
                <Link to="/create-trip/form" key="form">
                  <StyledBreadcrumb component="span" label="Form" />
                </Link>
              ),
              (pathname === "card" || pathname === "create-trip/card") && (
                <Link to="/create-trip/card" key="card">
                  <StyledBreadcrumb component="span" label="Card" />
                </Link>
              ),
            ]}

            {route == "my-trips" && [
              <Link to="/my-trips" key="my-trips">
                <StyledBreadcrumb component="span" label="My trips" />
              </Link>,
              (pathname == "last-created" ||
                pathname == "my-trips/last-created") && (
                <Link to="/my-trips/last-created" key="last-created">
                  <StyledBreadcrumb component="span" label="Last created" />
                </Link>
              ),
              (pathname == "all-trips" || pathname == "my-trips/all-trips") && (
                <Link to="/my-trips/all-trips" key="all-trips">
                  <StyledBreadcrumb component="span" label="All trips" />
                </Link>
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
