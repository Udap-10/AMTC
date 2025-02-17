"use client";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token"); // Get token from URL
  const [email, setEmail] = useState(""); // Get email from user input
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    console.log("Sending request with:", {
      email,
      newPassword,
      confirmPassword,
      token,
    });

    try {
      const res = await fetch("/api/users/resetPassword", {
        method: "PATCH", // Changed from POST to PATCH to match API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword, confirmPassword, token }), // Include token
      });

      const data = await res.json();
      console.log("Response received:", data); // Debugging log

      if (data.success) {
        setSuccess("Password has been successfully reset.");
        setTimeout(() => {
          setSuccess(""); // Clear message before redirecting
          router.push("/login"); // Redirect to login page
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mb: 2 }}
            href="/"
          >
            Reset Password
          </Button>
        </form>
      </Container>
    </Box>
  );
};

export default ResetPassword;
