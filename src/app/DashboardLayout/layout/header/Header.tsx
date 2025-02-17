"use client"; // Ensure this directive is placed at the top

import { AppBar, Badge, Box, IconButton, Toolbar, styled } from "@mui/material";
import { IconBellRinging, IconMenu } from "@tabler/icons-react";
import { useRouter } from "next/navigation"; // ✅ Correct for Next.js App Router

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react"; // Import React and useState, useEffect

import Profile from "./Profile";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType): JSX.Element => {
  const [isClient, setIsClient] = useState(false); // State to track if the component is rendered client-side

  // UseEffect to ensure the router is initialized in client-side context
  useEffect(() => {
    setIsClient(true); // Set to true when the component is mounted on the client
  }, []);

  // If not client-side, don't render the router-related logic
  if (!isClient) return <div />; // Prevent errors during SSR

  const router = useRouter(); // Initialize the router

  const handleNotificationClick = () => {
    console.log("Notification icon clicked!"); // Debugging log
    try {
      router.push("/DashboardLayout/Notification-Page");
    } catch (err) {
      console.error("Error during redirect:", err); // Catch any redirection errors
    }
  };

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
          onClick={handleNotificationClick} // Add onClick handler here
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton>
        <Box flexGrow={1} />
        <Profile />
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
