"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { getSession, useSession } from "next-auth/react"; // ✅ Import session handling
import { ChangeEvent, useEffect, useState } from "react";

type ProfileData = {
  username: string;
  email: string;
  phoneNumber: string; // Added
  address: string; // Added
  dob: Date; // Added
  profilePhoto: string;
};

type EditMode = {
  username: boolean;
  email: boolean;
  phoneNumber: boolean;
  address: boolean;
  dob: boolean;
  profilePhoto: boolean;
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState<EditMode>({
    username: false,
    email: false,
    phoneNumber: false,
    address: false,
    dob: false,
    profilePhoto: false,
  });

  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    dob: new Date(),
    profilePhoto: "",
  });

  const [profilePicture, setProfilePicture] = useState<string>();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession(); // Get user session

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 🔹 Fetch user profile data
        const response = await fetch("/api/users/signin", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log("📜 Signin API Response:", data);

        // ✅ Ensure user data is correctly extracted
        if (data.user) {
          setProfileData((prev) => ({
            ...prev,
            username: data.user.username || "",
            email: data.user.email || "",
          }));
        }

        // 🔹 Fetch user profile picture
        const imageResponse = await fetch("/api/users/image", {
          method: "GET",
          credentials: "include",
        });

        if (!imageResponse.ok) {
          throw new Error("Failed to fetch profile picture");
        }

        const imageData = await imageResponse.json();
        console.log("🖼 Profile Picture Response:", imageData);

        if (imageData.profilePhoto) {
          setProfilePicture(imageData.profilePhoto);
          setProfileData((prev) => ({
            ...prev,
            profilePhoto: imageData.profilePhoto,
          }));
        }
      } catch (error) {
        console.error("❌ Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditToggle = (field: keyof ProfileData) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const handlePictureChange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      console.log("📸 Picture change detected...");

      const file = event.target.files?.[0];
      if (!file) {
        console.warn("⚠️ No file selected.");
        return;
      }

      if (!session || !session.user?.id) {
        console.error("⚠️ User session not found.");
        return;
      }

      const userId = session.user.id; // Get userId from session

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId); // Send userId

      console.log("⬆️ Uploading file:", file.name);

      const response = await fetch("/api/users/image", {
        method: "POST", // Use POST to upload a new image
        body: formData,
      });

      console.log("📡 API response:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await response.json();
      if (!result.profilePhoto) {
        throw new Error("Invalid response: profilePhoto missing");
      }

      console.log("✅ Upload successful:", result.profilePhoto);
      setProfilePicture(result.profilePhoto);
    } catch (error) {
      console.error("❌ Error uploading profile picture:", error);
    }
  };

  const handleSave = async () => {
    try {
      const session = await getSession();

      if (!session?.user?.email) {
        console.error("❌ No email found in session.");
        alert("Error: Your email is missing. Please log in again.");
        return;
      }

      const profileUpdate = {
        phoneNumber: profileData.phoneNumber.trim(),
        dob: profileData.dob,
        address: profileData.address.trim(),
        profilePhoto: profileData.profilePhoto,
      };

      console.log("🔄 Sending profile update:", profileUpdate);

      const profileResponse = await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileUpdate),
      });

      const profileResult = await profileResponse.json();
      console.log("🔍 Profile Update Response:", profileResult);

      if (!profileResponse.ok) {
        throw new Error(
          profileResult.message || "Failed to update profile details"
        );
      }

      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Something went wrong while updating the profile.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 4,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{ padding: 4, width: "100%", maxWidth: 600, position: "relative" }}
      >
        <IconButton
          onClick={() => window.history.back()}
          sx={{ position: "absolute", top: 8, left: 8 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={profilePicture}
            alt="Profile Picture"
            sx={{ width: 120, height: 120, marginBottom: 2 }}
          />
          <input
            accept="image/*"
            id="profile-picture-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handlePictureChange}
          />
          <label htmlFor="profile-picture-upload">
            <Button variant="outlined" component="span" sx={{ mb: 3 }}>
              Edit Picture
            </Button>
          </label>
          <TextField
            fullWidth
            value={profileData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            onClick={() => handleEditToggle("username")}
            InputProps={{ readOnly: !isEditing.username }}
            label="Username"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            value={profileData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onClick={() => handleEditToggle("email")}
            InputProps={{ readOnly: !isEditing.email }}
            label="Email"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            value={profileData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            onClick={() => handleEditToggle("phoneNumber")}
            InputProps={{ readOnly: !isEditing.phoneNumber }}
            label="Phone Number"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={profileData.dob ? dayjs(profileData.dob) : null}
              onChange={(newValue) =>
                handleInputChange("dob", newValue ? newValue.toISOString() : "")
              }
              sx={{ mb: 2, width: "100%" }}
            />
          </LocalizationProvider>

          <TextField
            fullWidth
            value={profileData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            onClick={() => handleEditToggle("address")}
            InputProps={{ readOnly: !isEditing.address }}
            label="Address"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 3 }}
          >
            Save Profile
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
