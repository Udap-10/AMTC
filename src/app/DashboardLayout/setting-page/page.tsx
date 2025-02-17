"use client";

import PageContainer from "@/app/DashboardLayout/components/container/PageContainer";
import DashboardCard from "@/app/DashboardLayout/components/shared/DashboardCard";
import { useThemeContext } from "@/app/DashboardLayout/context/ThemeContextProvider/page";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SettingPage = () => {
  const { darkMode, toggleTheme } = useThemeContext(); // Access darkMode and toggleTheme from context

  // State management for password change
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match. Please try again.");
      return;
    }

    try {
      console.log("🔄 Sending password change request...");

      // ✅ Send request to API (session-based authentication)
      const response = await axios.put(
        "/api/users/passwordChange", // ✅ API route
        {
          oldPassword: currentPassword, // Ensure old password is sent
          newPassword,
          confirmPassword: newPassword, // Match backend field name
        },
        { withCredentials: true } // ✅ Ensure session is included
      );

      console.log("✅ API Response:", response.data);

      alert(response.data.message);

      // ✅ Reset state & UI
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("❌ Error changing password:", error);

      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response);
        alert(error.response?.data?.error || "Something went wrong");
      } else {
        alert("Something went wrong");
      }
    }
  };

  // Delete account function

  const router = useRouter(); // Initialize the router

  const handleDeleteAccount = async () => {
    try {
      console.log("🔄 Sending account deletion request...");

      const response = await fetch(`/api/users/Delete`, {
        method: "DELETE",
        credentials: "include", // ✅ Ensures session is sent
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Account deleted successfully!");
        localStorage.clear();
        router.push("/"); // Redirect to login page
      } else {
        console.error("❌ Error deleting account:", data.error);
        alert(
          data.error || "Something went wrong while deleting your account."
        );
      }
    } catch (error) {
      console.error("❌ Network error while deleting account:", error);
      alert("Something went wrong while deleting your account.");
    }
  };

  return (
    <PageContainer
      title="Setting Page"
      description="This is the settings page where you can manage preferences"
    >
      <DashboardCard title="Settings">
        <Box>
          {/* Mode Switcher */}
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={toggleTheme} />}
            label={`Switch to ${darkMode ? "Light" : "Dark"} Mode`}
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          {/* Profile Management Section */}
          <Typography variant="h6" sx={{ mb: 1, paddingTop: 2 }}>
            Password Settings
          </Typography>

          {/* Change Password Section */}
          <Button
            variant="outlined"
            onClick={() => setShowChangePassword(!showChangePassword)}
            endIcon={
              showChangePassword ? <ExpandLessIcon /> : <ExpandMoreIcon />
            }
            sx={{ mb: 2 }}
          >
            Change Password
          </Button>

          <Collapse in={showChangePassword}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              sx={{ mt: 2 }}
            >
              Save New Password
            </Button>
          </Collapse>

          {/* Notification Preferences Section */}
          <Typography variant="h6" sx={{ mb: 1, paddingTop: 2 }}>
            Notifications
          </Typography>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable Notifications"
            sx={{ mb: 1 }}
          />

          <Divider sx={{ my: 2 }} />

          {/* Delete Account Section */}
          <Box sx={{ mt: 2 }}>
            {!showDeleteConfirmation ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete Account
              </Button>
            ) : (
              // Modal centered in the middle of the page
              <>
                {/* Overlay background */}
                <Box
                  sx={{
                    position: "fixed", // Fixed to the page
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                    zIndex: 999,
                    color: darkMode ? "black" : "white", // Ensure it's on top of the overlay
                    // Make sure it overlays everything else
                  }}
                />
                <Box
                  sx={{
                    position: "fixed", // Fixed to the page
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Center the modal
                    backgroundColor: "white",
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "300px", // Width of the modal
                    zIndex: 1000,
                  }}
                >
                  {/* Text centered */}
                  <Typography
                    sx={{ textAlign: "center", mb: 2, color: "green" }}
                  >
                    Are you sure?
                  </Typography>

                  {/* Buttons centered below the message */}
                  <Box
                    display="flex"
                    gap={2}
                    justifyContent="center"
                    sx={{ width: "100%" }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDeleteAccount}
                      sx={{ width: "40%" }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setShowDeleteConfirmation(false)}
                      sx={{ width: "40%" }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default SettingPage;
