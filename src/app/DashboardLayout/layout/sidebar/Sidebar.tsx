import { Box, Drawer, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { useThemeContext } from "../../context/ThemeContextProvider/page"; // Adjust path to your context file
import SidebarItems from "./SidebarItems";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const MSidebar: React.FC<ItemType> = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}) => {
  const { darkMode } = useThemeContext();
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const mdDown = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const smDown = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const sidebarWidth = lgUp ? "270px" : smDown ? "200px" : "240px";

  // Custom scrollbar styles
  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#eff2f7",
      borderRadius: "15px",
    },
  };

  const renderLogo = (width: string, height: string) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        py: "20px",
      }}
    >
      <img
        src="/images/logos/2.jpg"
        alt="Logo"
        style={{
          width: width,
          height: height,
          borderRadius: "50%",
        }}
      />
      <Typography
        variant="h6"
        align="center"
        sx={{
          fontWeight: "bold",
          mt: "10px",
          color: darkMode ? "white" : "black",
          fontSize: smDown ? "0.9rem" : mdDown ? "1rem" : "1.1rem",
        }}
      >
        Smart Farm Security
      </Typography>
    </Box>
  );

  return lgUp ? (
    // Desktop Sidebar
    <Box
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
      }}
    >
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        variant="permanent"
        PaperProps={{
          sx: {
            boxSizing: "border-box",
            width: sidebarWidth,
            ...scrollbarStyles,
            backgroundColor: darkMode ? "#333" : "#fff",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Logo and Navigation Items */}
          {renderLogo("170px", "155px")}
          <Box sx={{ flexGrow: 1 }}>
            <SidebarItems />
          </Box>
        </Box>
      </Drawer>
    </Box>
  ) : (
    // Mobile Sidebar
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          boxShadow: (theme) => theme.shadows[8],
          width: sidebarWidth,
          ...scrollbarStyles,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          pt: "10px",
        }}
      >
        {renderLogo(
          smDown ? "100px" : mdDown ? "120px" : "170px",
          smDown ? "90px" : mdDown ? "110px" : "155px"
        )}
        <Box sx={{ flexGrow: 1 }}>
          <SidebarItems />
        </Box>
      </Box>
    </Drawer>
  );
};

export default MSidebar;
