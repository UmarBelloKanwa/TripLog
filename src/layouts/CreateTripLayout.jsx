import React from "react";
import { Outlet } from "react-router-dom";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useDemoRouter } from "@toolpad/core/internal";

const CreateTripLayout = () => {
  const router = useDemoRouter("/");  
  
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
};

export default CreateTripLayout;
