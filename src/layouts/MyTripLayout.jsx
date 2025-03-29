import React from "react";
import Container from "@mui/material/Container";

const MyTripLayout = ({ pathname}) => {
  return (
     <Container sx={{ my: 2 }}>
      <h1> { pathname} </h1>
    </Container>
  );
};

export default MyTripLayout;