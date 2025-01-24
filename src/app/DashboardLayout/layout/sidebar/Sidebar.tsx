import { Box, Drawer, Typography, useMediaQuery } from "@mui/material";
import { Sidebar } from "react-mui-sidebar";
import { useThemeContext } from "../../context/ThemeContextProvider/page"; // Adjust path to your context file
import SidebarItems from "./SidebarItems";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const MSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const { darkMode } = useThemeContext(); // Accessing darkMode from context
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg")); // Large screens
  const mdDown = useMediaQuery((theme: any) => theme.breakpoints.down("md")); // Medium and smaller screens
  const smDown = useMediaQuery((theme: any) => theme.breakpoints.down("sm")); // Small screens

  const sidebarWidth = lgUp ? "270px" : smDown ? "200px" : "240px"; // Sidebar width based on screen size

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

  // Define original logo size
  const originalLogoWidth = 170; // Original width
  const originalLogoHeight = 155; // Original height

  return lgUp ? (
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
            ...scrollbarStyles,
            backgroundColor: darkMode ? "#333" : "#fff", // Background color based on darkMode
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
          <Sidebar
            width={sidebarWidth}
            collapsewidth="80px"
            open={isSidebarOpen}
            themeColor="#5d87ff"
            themeSecondaryColor="#49beff"
            showProfile={false}
          >
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                paddingY: "20px",
              }}
            >
              <img
                src="/images/logos/2.jpg"
                alt="Logo"
                style={{
                  width: `${originalLogoWidth}px`, // Set the original width for large screens
                  height: `${originalLogoHeight}px`, // Set the original height for large screens
                  borderRadius: "50%",
                }}
              />
              <Typography
                variant="h6"
                align="center"
                sx={{
                  fontWeight: "bold",
                  marginTop: "10px",
                  color: darkMode ? "white" : "black",
                  fontSize: smDown ? "0.9rem" : mdDown ? "1rem" : "1.1rem",
                }}
              >
                Smart Farm Security
              </Typography>
            </Box>

            {/* Sidebar Items */}
            <Box>
              <SidebarItems />
            </Box>
          </Sidebar>
        </Box>
      </Drawer>
    </Box>
  ) : (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          boxShadow: (theme) => theme.shadows[8],
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
          paddingTop: "10px",
        }}
      >
        <Sidebar
          width={sidebarWidth}
          collapsewidth="80px"
          isCollapse={false}
          mode="light"
          direction="ltr"
          themeColor="#5d87ff"
          themeSecondaryColor="#49beff"
          showProfile={false}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingY: "10px",
            }}
          >
            {/* Responsive Logo for smaller screens */}
            <img
              src="/images/logos/2.jpg"
              alt="Logo"
              style={{
                width: smDown ? "100px" : mdDown ? "120px" : `${originalLogoWidth}px`, // Adjust logo size based on screen size
                height: smDown ? "90px" : mdDown ? "110px" : `${originalLogoHeight}px`, // Adjust height accordingly
                borderRadius: "50%",
              }}
            />
            <Typography
              variant="h6"
              align="center"
              sx={{
                fontWeight: "bold",
                marginTop: "8px",
                color: darkMode ? "white" : "black",
                fontSize: smDown ? "0.8rem" : "1rem",
              }}
            >
              Smart Farm Security
            </Typography>
          </Box>

          <SidebarItems />
        </Sidebar>
      </Box>
    </Drawer>
  );
};

export default MSidebar;
