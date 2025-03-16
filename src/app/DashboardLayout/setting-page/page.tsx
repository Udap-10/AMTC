"use client";

import PageContainer from "@/app/DashboardLayout/components/container/PageContainer";
import { useThemeContext } from "@/app/DashboardLayout/context/ThemeContextProvider/page";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Card,
  CardContent,
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
  const { darkMode, toggleTheme } = useThemeContext();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const router = useRouter();

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await axios.put(
        "/api/users/passwordChange",
        {
          oldPassword: currentPassword,
          newPassword,
          confirmPassword: newPassword,
        },
        { withCredentials: true }
      );

      alert(response.data.message);
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Something went wrong");
      } else {
        alert("Something went wrong");
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`/api/users/Delete`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Account deleted successfully!");
        localStorage.clear();
        router.push("/");
      } else {
        alert(
          data.error || "Something went wrong while deleting your account."
        );
      }
    } catch (error) {
      alert("Something went wrong while deleting your account.");
    }
  };

  return (
    <PageContainer
      title="Setting Page"
      description="This is the settings page where you can manage preferences"
    >
      <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" color="green" gutterBottom>
            Setting
          </Typography>

          {/* Dark Mode Toggle */}
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={toggleTheme} />}
            label={`Switch to ${darkMode ? "Light" : "Dark"} Mode`}
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          {/* Password Settings */}
          <Typography variant="h6" sx={{ mb: 1, pt: 2 }}>
            Password Setting
          </Typography>

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

          <Divider sx={{ my: 3 }} />

          {/* Delete Account Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Don’t want an account anymore?
            </Typography>

            {!showDeleteConfirmation ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete Account
              </Button>
            ) : (
              <>
                {/* Overlay */}
                <Box
                  sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                  }}
                />
                {/* Modal */}
                <Box
                  sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "300px",
                    zIndex: 1000,
                  }}
                >
                  <Typography
                    sx={{ textAlign: "center", mb: 2, color: "green" }}
                  >
                    Are you sure?
                  </Typography>

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
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default SettingPage;
