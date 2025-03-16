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
  const [profilePhoto, setProfilePhoto] = useState("/default-avatar.png");

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      const userId = localStorage.getItem("_id");

      if (!userId) {
        console.warn("⚠️ No user ID found in localStorage.");
        return;
      }

      const cachedPhoto = localStorage.getItem("profilePhoto");
      if (cachedPhoto) {
        setProfilePhoto(cachedPhoto);
        return;
      }

      try {
        const res = await fetch(`/api/users/image?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.profilePhoto) {
            setProfilePhoto(data.profilePhoto);
            localStorage.setItem("profilePhoto", data.profilePhoto);
          } else {
            console.warn("⚠️ No profilePhoto in API response");
          }
        } else {
          console.warn("⚠️ Failed to fetch profile image from API");
        }
      } catch (error) {
        console.error("❌ Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("✅ Logged out successfully");
        localStorage.removeItem("_id");
        localStorage.removeItem("profilePhoto");
        window.location.href = "/authentication/login";
      } else {
        console.error("❌ Logout failed");
      }
    } catch (err) {
      console.error("❌ Error during logout:", err);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show profile"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick2}
        sx={{
          ...(anchorEl2 && { color: "primary.main" }),
        }}
      >
        <Avatar
          src={profilePhoto}
          alt="Profile Image"
          sx={{ width: 35, height: 35 }}
        />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{ "& .MuiMenu-paper": { width: "200px" } }}
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
            variant="outlined"
            color="primary"
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
