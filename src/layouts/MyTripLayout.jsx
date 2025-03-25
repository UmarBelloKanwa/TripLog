import React from "react";
import { Outlet } from "react-router-dom";
import { PageHeader, PageContainer } from "@toolpad/core/PageContainer";

const MyTripLayout = () => {
  return (
    <PageContainer>
      <PageHeader />
      <Outlet />
    </PageContainer>
  );
};

export default MyTripLayout;