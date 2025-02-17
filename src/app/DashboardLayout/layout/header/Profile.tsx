"use client";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const [profileData, setProfileData] = useState({
    profilePhoto: "",
  });
  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem("_id");

      if (!userId) {
        console.warn("⚠️ User ID not found in localStorage. Skipping fetch.");
        return;
      }

      try {
        const imageResponse = await fetch(`/api/users/image?userId=${userId}`);

        if (!imageResponse.ok) throw new Error("Failed to fetch profile photo");

        const imageData = await imageResponse.json();

        // Store profile photo URL in localStorage
        localStorage.setItem("profilePhoto", imageData.profilePhoto);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("✅ Logged out successfully");
        window.location.href = "/authentication/login";
      } else {
        console.error("❌ Failed to logout");
      }
    } catch (error) {
      console.error("❌ Error logging out:", error);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={handleClick2}
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
      >
        <Avatar
          src={localStorage.getItem("profilePhoto") || profileData.profilePhoto}
          alt="Profile Image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem
          component={Link}
          href="/ProfilePage/profile"
          onClick={handleClose2}
        >
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <Box mt={1} py={1} px={2}>
          <Button
            href="/authentication/login"
            variant="outlined"
            color="primary"
            component={Link}
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};
export default Profile;
