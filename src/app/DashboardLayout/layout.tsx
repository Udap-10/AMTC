"use client";
import Header from "@/app/DashboardLayout/layout/header/Header";
import { Box, Container, styled } from "@mui/material";
import dynamic from "next/dynamic";
import React, { useState } from "react";

// Dynamic import for Sidebar to prevent SSR issues
const Sidebar = dynamic(
  () => import("@/app/DashboardLayout/layout/sidebar/Sidebar"),
  {
    ssr: false,
  }
);

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh", // Fixed minHeight
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  console.log("isSidebarOpen", isSidebarOpen); // Debugging
  console.log("isMobileSidebarOpen", isMobileSidebarOpen); // Debugging

  return (
    <MainWrapper className="mainwrapper">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      {/* Main Wrapper */}
      <PageWrapper className="page-wrapper">
        {/* Header */}
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        {/* Page Content */}
        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "1200px",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
