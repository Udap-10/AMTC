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
import { useSession } from "next-auth/react"; // ✅ Import session handling
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
      // 🔹 Step 0: Fallback profilePhoto fetch from localStorage userId (optional early load)
      const localUserId = localStorage.getItem("_id");
      console.log(localUserId);
      if (localUserId && !localStorage.getItem("profilePhoto")) {
        try {
          const imageResponse = await fetch(
            `/api/users/image?userId=${localUserId}`
          );
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            localStorage.setItem("profilePhoto", imageData.profilePhoto);
            setProfileData((prev) => ({
              ...prev,
              profilePhoto: imageData.profilePhoto,
            }));
          } else {
            console.warn("⚠️ Failed to fetch profile photo from local userId");
          }
        } catch (error) {
          console.error("❌ Error fetching profile from local userId:", error);
        }
      }

      // 🔹 Step 1: Fetch user data (signin API)
      try {
        const response = await fetch("/api/users/signin", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        console.log("📜 Signin API Response:", data);

        if (data.user) {
          // Store _id in localStorage
          if (!localStorage.getItem("_id")) {
            localStorage.setItem("_id", data.user.id);
          }

          // Set username & email
          setProfileData((prev) => ({
            ...prev,
            username: data.user.username || "",
            email: data.user.email || "",
          }));

          // 🔹 Step 2: Fetch extended profile info
          const profileResponse = await fetch("/api/users/profile", {
            method: "GET",
            credentials: "include",
          });

          if (!profileResponse.ok)
            throw new Error("Failed to fetch profile details");

          const profileData = await profileResponse.json();
          console.log("📄 Profile API Response:", profileData);

          if (profileData?.user) {
            setProfileData((prev) => ({
              ...prev,
              phoneNumber: profileData.user.phoneNumber || "",
              dob: profileData.user.dob || "",
              address: profileData.user.address || "",
              profilePhoto: profileData.user.profilePhoto || "",
            }));

            // 🔹 Step 3: Fetch profile image by userId (from db)
            const userId = profileData.user.id || data.user.id;
            if (userId) {
              console.log(`this is inside UserID ${userId}`);
              const imageResponse = await fetch(
                `/api/users/image?userId=${userId}`,
                {
                  method: "GET",
                  credentials: "include",
                }
              );
              console.log(
                `🔍 Fetching profile image for userId: ${imageResponse}`
              );

              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                console.log("🖼️ Profile Image API Response:", imageData);

                if (imageData.profilePhoto) {
                  setProfileData((prev) => ({
                    ...prev,
                    profilePhoto: imageData.profilePhoto,
                  }));
                  localStorage.setItem("profilePhoto", imageData.profilePhoto);
                } else {
                  console.warn("⚠️ No profile picture found from image API.");
                }
              } else {
                console.error(
                  "❌ Failed to fetch profile image:",
                  imageResponse.status
                );
              }
            }
          } else {
            console.warn("⚠️ Profile data missing or malformed.");
          }
        } else {
          console.warn("⚠️ No user data found from signin.");
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await response.json();
      if (!result.profilePhoto) {
        throw new Error("Invalid response: profilePhoto missing");
      }

      console.log("✅ Upload successful:", result.profilePhoto);

      // After the upload, update the profileData state
      setProfileData((prev) => ({
        ...prev,
        profilePhoto: result.profilePhoto, // Update profile photo
      }));

      // Optionally, you can also set it directly using setProfilePicture if needed
      setProfilePicture(result.profilePhoto); // This assumes you're using setProfilePicture somewhere else
    } catch (error) {
      console.error("❌ Error uploading profile picture:", error);
    }
  };

  const handleSave = async () => {
    try {
      console.log("🚀 Sending profile update request:", profileData);

      // First, send the POST request to update the profile fields (address, dob, phoneNumber, profilePhoto)
      const postResponse = await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure session cookies are sent
        body: JSON.stringify({
          address: profileData.address?.trim() || "", // Ensure valid strings
          dob: profileData.dob ? new Date(profileData.dob).toISOString() : null, // Convert to ISO format if available
          phoneNumber: profileData.phoneNumber?.trim() || "",
          profilePhoto: profileData.profilePhoto?.trim() || "",
        }),
      });

      const postData = await postResponse.json();

      if (!postResponse.ok) {
        console.error("❌ API Error (POST):", postData);
        alert(`Error: ${postData.message || "Failed to update profile"}`);
        return;
      }

      console.log("✅ Profile updated successfully (POST):", postData);

      // Then, send the PATCH request to update the username and email

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  console.log("👤 Profile Data:", profileData.profilePhoto);

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
            src={profileData.profilePhoto}
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
