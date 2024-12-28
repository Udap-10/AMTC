"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  TextField
} from "@mui/material";

import { ChangeEvent, useState } from "react";

type ProfileData = {
  name: string;
  email: string;
  department: string;
  city: string;
  currentPassword: string;
  phoneNumber: string; // Added
  address: string;     // Added
  dob: string;         // Added
};

type EditMode = {
  name: boolean;
  email: boolean;
  department: boolean;
  city: boolean;
  password: boolean;
  phoneNumber: boolean; // Added
  address: boolean;     // Added
  dob: boolean;         // Added
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState<EditMode>({
    name: false,
    email: false,
    department: false,
    city: false,
    password: false,
    phoneNumber: false, // Added
    address: false,     // Added
    dob: false,         // Added
  });

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    department: "",
    city: "",
    currentPassword: "",
    phoneNumber: "", // Added
    address: "",     // Added
    dob: "",         // Added
  });

  const [profilePicture, setProfilePicture] = useState<string>("/images/profile/user-1.jpg");
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleEditToggle = (field: keyof ProfileData) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
    }
  };

  const handleSave = () => {
    console.log("Profile data saved:", profileData);
    alert("Profile saved successfully!");
    setIsEditing({
      name: false,
      email: false,
      department: false,
      city: false,
      password: false,
      phoneNumber: false,
      address: false,
      dob: false,
    });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: 4, backgroundColor: "#f5f5f5" }}>
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 600, position: "relative" }}>
        <IconButton onClick={() => window.history.back()} sx={{ position: "absolute", top: 8, left: 8 }}>
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar src={profilePicture} alt="Profile Picture" sx={{ width: 120, height: 120, marginBottom: 2 }} />
          <input accept="image/*" id="profile-picture-upload" type="file" style={{ display: "none" }} onChange={handlePictureChange} />
          <label htmlFor="profile-picture-upload">
            <Button variant="outlined" component="span" sx={{ mb: 3 }}>
              Edit Picture
            </Button>
          </label>

          {/* Existing Fields */}
          <TextField
            fullWidth
            value={profileData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onClick={() => handleEditToggle("name")}
            InputProps={{ readOnly: !isEditing.name }}
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

          {/* New Fields */}
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
          <TextField
            fullWidth
            value={profileData.dob}
            onChange={(e) => handleInputChange("dob", e.target.value)}
            onClick={() => handleEditToggle("dob")}
            InputProps={{ readOnly: !isEditing.dob }}
            label="Date of Birth"
            variant="outlined"
            sx={{ mb: 2 }}
          />

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

          

          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 3 }}>
            Save Profile
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
