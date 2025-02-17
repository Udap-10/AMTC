"use client";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users/forgetPasswordLink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Password reset link sent to your email.");
        setError(""); // Clear previous errors
      } else {
        setError(data.message || "Failed to send reset link.");
        setSuccess(""); // Clear previous success messages
      }
    } catch (err) {
      console.error("Error sending reset link:", err);
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
          Forgot Password
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
          <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
            Send Reset Link
          </Button>
        </form>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
