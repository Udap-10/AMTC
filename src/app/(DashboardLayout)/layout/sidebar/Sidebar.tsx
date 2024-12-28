import { Box, Drawer, Typography, useMediaQuery } from "@mui/material";
import { Logo, Sidebar } from "react-mui-sidebar";
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
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

  const sidebarWidth = "270px";

  // Custom CSS for short scrollbar
  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#eff2f7",
      borderRadius: "15px",
    },
  };

  if (lgUp) {
    return (
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
              backgroundColor: darkMode ? "#333" : "#fff", // Set background based on darkMode
            },
          }}
        >
          <Box sx={{ height: "100%" }}>
            <Sidebar
              width={"270px"}
              collapsewidth="80px"
              open={isSidebarOpen}
              themeColor="#5d87ff"
              themeSecondaryColor="#49beff"
              showProfile={false}
            >
              <img
                src="/images/logos/2.jpg"
                style={{
                  width: "170px",
                  height: "155px",
                  fill: "none",
                  paddingTop: "10px",
                  marginLeft: "50px",
                  marginTop: "15px",
                  borderRadius: "50%",
                }}
              />
              <Typography
                variant="h6"
                align="center"
                padding={2}
                style={{
                  fontWeight: "bold",
                  color: darkMode ? "white" : "black", // Change text color based on darkMode
                }}
              >
                Smart Farm Security
              </Typography>

              <Box>
                <SidebarItems />
              </Box>
            </Sidebar>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
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
      <Box px={2}>
        <Sidebar
          width={"270px"}
          collapsewidth="80px"
          isCollapse={false}
          mode="light"
          direction="ltr"
          themeColor="#5d87ff"
          themeSecondaryColor="#49beff"
          showProfile={false}
        >
          <Logo
            img="/images/logos/2.jpg"
            style={{
              width: "150px",
              height: "145px",
              fill: "none",
              Padding: "50px",
            }}
          />
          <SidebarItems />
        </Sidebar>
      </Box>
    </Drawer>
  );
};

export default MSidebar;
