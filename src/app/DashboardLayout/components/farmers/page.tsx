"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DevicesIcon from "@mui/icons-material/Devices";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import PetsIcon from "@mui/icons-material/Pets";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const initialFarmersData = [{}];

const FarmersPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [anchorElDzongkhag, setAnchorElDzongkhag] =
    useState<null | HTMLElement>(null);
  const [anchorElGewog, setAnchorElGewog] = useState<null | HTMLElement>(null);
  const [anchorElVillage, setAnchorElVillage] = useState<null | HTMLElement>(
    null
  );
  const [anchorElSystem, setAnchorElSystem] = useState<null | HTMLElement>(
    null
  );
  const [farmersData, setFarmersData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editFarmer, setEditFarmer] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [farmerToDelete, setFarmerToDelete] = useState<null | number>(null);
  const [selectedDzongkhag, setSelectedDzongkhag] = useState<string | null>(
    null
  );
  const [selectedGewog, setSelectedGewog] = useState<string | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [selectedsystemID, setSelectedsystemID] = useState<number | null>(null);
  const [contactNumber, setContactNumber] = useState("");
  const [message, setMessage] = useState("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [animalData, setAnimalData] = useState<any[]>([]);

  useEffect(() => {
    const fetchFarmersData = async () => {
      try {
        const response = await fetch("/api/Farmer");
        const farmers = await response.json();

        // Fetch profile pictures for each farmer
        const updatedFarmers = await Promise.all(
          farmers.map(async (farmer: { contactNumber: any }) => {
            try {
              const profileResponse = await fetch(
                `/api/farmerProfile?contactNumber=${farmer.contactNumber}`
              );

              if (!profileResponse.ok) {
                // If profile not found, ignore it
                return { ...farmer, profilePicture: null };
              }

              const profileData = await profileResponse.json();

              return {
                ...farmer,
                profilePicture: profileData.myFile || null, // Ensure correct field
              };
            } catch {
              return { ...farmer, profilePicture: null }; // Default to null on error
            }
          })
        );

        setFarmersData(updatedFarmers);
        console.log(updatedFarmers);
      } catch (error) {
        console.error("Error fetching farmers data:", error);
      }
    };

    fetchFarmersData();
  }, []);

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    const res = await fetch("/api/System");
    const data = await res.json();
    setTableData(data);
  };

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await fetch("/api/Animals");
        const data = await response.json();
        console.log("Animal data:", data);
        setAnimalData(data.animals);
      } catch (error) {
        console.error("Error fetching animal data:", error);
        return 0; // Return 0 if there's an error
      }
    };

    fetchAnimalData();
  }, []);

  const handleAddNewMember = () => {
    router.push("/DashboardLayout/components/dashboard/AddMember"); // Correct path to match the new location
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleDzongkhagFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElDzongkhag(event.currentTarget);
  };
  const handleGewogFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElGewog(event.currentTarget);
  };

  const handleVillageFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElVillage(event.currentTarget);
  };
  const handleSystemsCardClick = () => {
    router.push("/DashboardLayout/components/System");
  };

  const handleAnimalsCardClick = () => {
    router.push("/DashboardLayout/components/Animals");
  };

  const handleSystemFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSystem(event.currentTarget);
  };

  const handleDzongkhagFilterClose = (Dzongkhag: string | null) => {
    setSelectedDzongkhag(Dzongkhag);
    setAnchorElDzongkhag(null);
  };

  const handleGewogFilterClose = (Gewog: string | null) => {
    setSelectedGewog(Gewog);
    setAnchorElGewog(null);
  };

  const handleVillageFilterClose = (Village: string | null) => {
    setSelectedVillage(Village);
    setAnchorElVillage(null);
  };

  const handleSystemFilterClose = (systemID: number | null) => {
    setSelectedsystemID(systemID);
    setAnchorElSystem(null);
  };

  const handleEdit = (index: number) => {
    setEditFarmer({ ...farmersData[index], index });
  };

  const handleDelete = (index: number) => {
    setFarmerToDelete(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (farmerToDelete !== null) {
      const farmer = farmersData[farmerToDelete]; // Get the farmer details
      if (!farmer || !farmer.CID) {
        setMessage("Error: CID is missing.");
        return;
      }

      setFarmersData((prev) => prev.filter((_, i) => i !== farmerToDelete));

      try {
        // Send DELETE request with CID in the body
        const response = await fetch("/api/Farmer", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ CID: farmer.CID }), // Send CID instead of contactNumber
        });

        const data = await response.json();
        setMessage(data.message); // Display success/error message
      } catch (error) {
        setMessage("Error deleting user.");
      }

      setDeleteDialogOpen(false);
      setFarmerToDelete(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedDzongkhag(null);
    setSelectedGewog(null);
    setSelectedVillage(null);
    setSelectedsystemID(null);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditFarmer((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSave = async () => {
    if (!editFarmer?.CID) {
      setMessage("Error: CID is required for updating.");
      return;
    }

    try {
      const response = await fetch("/api/Farmer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFarmer), // Send updated farmer details
      });

      const data = await response.json();
      if (response.ok) {
        setFarmersData((prev) =>
          prev.map((farmer, i) =>
            i === editFarmer.index ? { ...farmer, ...editFarmer } : farmer
          )
        );
        setMessage("Farmer updated successfully.");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error updating farmer.");
    }

    setEditFarmer(null); // Close dialog after update
  };

  const filteredFarmers = farmersData.filter((farmer) => {
    const matchesSearch = farmer.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesDzongkhag = selectedDzongkhag
      ? farmer.Dzongkhag === selectedDzongkhag
      : true;
    const matchesGewog = selectedGewog ? farmer.Gewog === selectedGewog : true;

    const matchesVillage = selectedVillage
      ? farmer.Village === selectedVillage
      : true;
    const matchessystemID = selectedsystemID
      ? farmer.systemID === selectedsystemID
      : true;
    return (
      matchesSearch &&
      matchesDzongkhag &&
      matchessystemID &&
      matchesGewog &&
      matchesVillage
    );
  });

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={3}
            sx={{
              padding: 2,
              textAlign: "center",
              borderRadius: "12px",
              backgroundColor: "#b0e892",
            }}
            onClick={handleSystemsCardClick}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 1,
              }}
            >
              <DevicesIcon
                sx={{ fontSize: 35, color: "#027c68", marginRight: 1 }}
              />
              <Typography variant="body1" fontWeight="bold">
                Number of Systems
              </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              {tableData.length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={3}
            sx={{
              padding: 2,
              textAlign: "center",
              borderRadius: "12px",
              backgroundColor: "#b0e892",
            }}
            onClick={handleAnimalsCardClick}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 1,
              }}
            >
              <PetsIcon
                sx={{ fontSize: 35, color: "#027c68", marginRight: 1 }}
              />
              <Typography variant="body1" fontWeight="bold">
                Total Number of Animals Detected
              </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              {animalData.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box
        sx={{
          marginTop: 5,
          padding: 2,
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color="forestgreen"
          sx={{ marginBottom: 2 }}
        >
          Farmer Information
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            gap: 3, // Increased gap to create space between both sections
          }}
        >
          {/* Left Section: Dzongkhag & Reset Filter Buttons */}
          <Box sx={{ display: "flex", gap: 5, alignItems: "center" }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleDzongkhagFilterClick}
              sx={{
                borderColor: "#99cc66",
                color: "black",
                borderRadius: "8px",
                width: "150px", // Fixed width for better alignment
                height: "50px", // Fixed height for better alignment
                "&:hover": { backgroundColor: "#f4f8f1" },
              }}
            >
              Dzongkhag
            </Button>
            <Menu
              anchorEl={anchorElDzongkhag}
              open={Boolean(anchorElDzongkhag)}
              onClose={() => handleDzongkhagFilterClose(null)}
            >
              {[
                "Paro",
                "Haa",
                "Thimphu",
                "Chhukha",
                "Tsirang",
                "Bumthang",
                "Gelephu",
              ].map((Dzongkhag) => (
                <MenuItem
                  key={Dzongkhag}
                  onClick={() => handleDzongkhagFilterClose(Dzongkhag)}
                >
                  {Dzongkhag}
                </MenuItem>
              ))}
            </Menu>

            <Button
              variant="outlined"
              onClick={resetFilters}
              sx={{
                borderColor: "#99cc66",
                color: "black",
                borderRadius: "8px",
                width: "150px", // Fixed width for better alignment
                height: "50px", // Fixed height for better alignment
                display: "flex",

                "&:hover": { backgroundColor: "#f4f8f1" },
              }}
            >
              Reset Filters
            </Button>
          </Box>

          {/* Right Section: Add New Member Button & Search Input */}
          <Box sx={{ display: "flex", gap: 5, alignItems: "center" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                router.push("/DashboardLayout/components/dashboard/AddMember")
              }
              sx={{
                backgroundColor: "#99cc66",
                color: "#fff",
                borderRadius: "8px",
                height: "50px", // Fixed height for better alignment
                "&:hover": { backgroundColor: "#85b358" },
              }}
            >
              Add New Member
            </Button>

            <TextField
              placeholder="Search"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                width: "250px", // Fixed width for better alignment
                height: "40 px", // Fixed height for better alignment
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        <TableContainer
          sx={{
            backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
            borderRadius: "8px",
            boxShadow: isDarkMode
              ? "0px 0px 10px rgba(255,255,255,0.1)"
              : "0px 0px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Table>
            <TableHead
              sx={{
                backgroundColor: isDarkMode ? "#333" : "#f5f5f5",
              }}
            >
              <TableRow
                sx={{
                  color: isDarkMode ? "#bbdefb" : "#000",
                }}
              >
                <TableCell>
                  <strong>NAME</strong>
                </TableCell>
                <TableCell>
                  <strong>CID</strong>
                </TableCell>
                <TableCell>
                  <strong>CONTACT</strong>
                </TableCell>
                <TableCell>
                  <strong>DZONGKHAG</strong>
                </TableCell>
                <TableCell>
                  <strong>GEWOG</strong>
                </TableCell>
                <TableCell>
                  <strong>VILLAGE</strong>
                </TableCell>

                <TableCell>
                  <strong>ACTION</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFarmers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((farmer, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
                      "&:hover": {
                        backgroundColor: isDarkMode ? "#383838" : "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={farmer.profilePicture || ""}
                          sx={{
                            marginRight: 1,
                            backgroundColor: isDarkMode ? "#66cc99" : "#99cc66",
                          }}
                        >
                          {!farmer.profilePicture && farmer.name.charAt(0)}
                        </Avatar>
                        {farmer.name}
                      </Box>
                    </TableCell>

                    <TableCell sx={{ color: isDarkMode ? "#ddd" : "#000" }}>
                      {farmer.CID}
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? "#ddd" : "#000" }}>
                      {farmer.contactNumber}
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? "#ddd" : "#000" }}>
                      {farmer.Dzongkhag}
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? "#ddd" : "#000" }}>
                      {farmer.Gewog}
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? "#ddd" : "#000" }}>
                      {farmer.Village}
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EditIcon
                          sx={{
                            cursor: "pointer",
                            color: isDarkMode ? "#90caf9" : "#027c68",
                          }}
                          onClick={() => handleEdit(index)}
                        />
                        <DeleteIcon
                          sx={{
                            cursor: "pointer",
                            color: isDarkMode ? "#f44336" : "#d32f2f",
                          }}
                          onClick={() => handleDelete(index)}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={filteredFarmers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          sx={{
            backgroundColor: isDarkMode ? "#222" : "#f9f9f9",
            color: isDarkMode ? "#bbb" : "#000",
            borderTop: isDarkMode ? "1px solid #444" : "1px solid #ddd",
          }}
        />

        {/* Edit Farmer Dialog */}
        <Dialog open={Boolean(editFarmer)} onClose={() => setEditFarmer(null)}>
          <DialogTitle sx={{ color: "forestgreen", fontWeight: "bold" }}>
            Edit Farmer
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              variant="outlined"
              value={editFarmer?.name || ""}
              onChange={(e) => handleEditChange("name", e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="CID"
              variant="outlined"
              value={editFarmer?.CID || ""}
              onChange={(e) => handleEditChange("CID", e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Contact"
              variant="outlined"
              value={editFarmer?.contactNumber || ""}
              onChange={(e) =>
                handleEditChange("contactNumber", e.target.value)
              }
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Dzongkhag"
              variant="outlined"
              value={editFarmer?.Dzongkhag || ""}
              onChange={(e) => handleEditChange("Dzongkhag", e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Gewog"
              variant="outlined"
              value={editFarmer?.Gewog || ""}
              onChange={(e) => handleEditChange("Gewog", e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Village"
              variant="outlined"
              value={editFarmer?.Village || ""}
              onChange={(e) => handleEditChange("Village", e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditFarmer(null)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this farmer?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default FarmersPage;
