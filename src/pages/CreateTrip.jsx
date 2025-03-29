import * as React from "react";
import AppContext from "../contexts/AppContextProvider";
import CreateTripForm from "../components/CreateTripForm";
import CreateTripCard from "../components/CreateTripCard";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const CreateTrip = () => {
  const { pathname } = React.useContext(AppContext);

  console.log(pathname);
  return (
    <Box
      sx={{
        textAlign: "center",
        m: "auto",
      }}
    >
      <Typography
        variant="h4"
        textAlign="left"
        sx={{ width: "fit-content", m: 0, mt: 0.7, mb: 0.5 }}
      >
        Create new trip
      </Typography>
      {(pathname == "/create-trip" ||
        pathname == "/form" ||
        pathname == "/create-trip/form" ||
        pathname == "/") && <CreateTripForm />}
      {(pathname == "/create-trip/card" || pathname == "/card") && (
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "65%",
            },
            m: "auto",
          }}
        >
          <CreateTripCard />
        </Box>
      )}
    </Box>
  );
};

export default CreateTrip;
