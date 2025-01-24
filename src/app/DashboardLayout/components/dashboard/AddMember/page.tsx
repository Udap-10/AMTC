"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Box, Typography, Grid } from "@mui/material";

const AddMember: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [fid, setFid] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [systemId, setSystemId] = useState(1);

  const handleBackClick = () => {
    router.push("/DashboardLayout/components/farmers");
  };

  const handleSubmit = () => {
    const newMember = {
      name,
      fid,
      contact,
      address,
      systemId,
    };

    // Get current farmers data from localStorage or use a default value
    const existingFarmers = JSON.parse(localStorage.getItem("farmersData") || "[]");

    // Add the new member to the existing data array
    const updatedFarmers = [...existingFarmers, newMember];

    // Save the updated farmers list back to localStorage
    localStorage.setItem("farmersData", JSON.stringify(updatedFarmers));

    // Redirect to farmers page after submission
    router.push("/components/farmers");
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f7fdf4", borderRadius: 3, maxWidth: 600, margin: "auto", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <Typography variant="h5" sx={{ color: "forestgreen", textAlign: "center", marginBottom: 3, fontWeight: "bold" }}>
        Add New Member
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ backgroundColor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="CID"
            variant="outlined"
            fullWidth
            value={fid}
            onChange={(e) => setFid(e.target.value)}
            sx={{ backgroundColor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Contact Number"
            variant="outlined"
            fullWidth
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            sx={{ backgroundColor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ backgroundColor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="System ID"
            variant="outlined"
            fullWidth
            value={systemId}
            onChange={(e) => setSystemId(Number(e.target.value))}
            sx={{ backgroundColor: "#fff" }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <Button variant="contained" onClick={handleBackClick} sx={{ backgroundColor: "#99cc66", color: "#fff", "&:hover": { backgroundColor: "#85b358" } }}>
          Go Back
        </Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: "forestgreen", color: "#fff", "&:hover": { backgroundColor: "#228B22" } }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AddMember;
