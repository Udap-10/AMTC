"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Typography,
  Box,
  Grid,
  Divider,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  InputAdornment,
  Menu,
  MenuItem,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import PetsIcon from "@mui/icons-material/Pets";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const initialFarmersData = [
  { name: "Deepu", fid: "02210196", contact: "77246430", address: "Paro", systemId: 1 },
  { name: "Udap", fid: "02210111", contact: "17324560", address: "Haa", systemId: 2 },
  { name: "Wangchuk", fid: "02210122", contact: "77543729", address: "Paro", systemId: 1 },
  { name: "Pala", fid: "02210217", contact: "77246430", address: "Paro", systemId: 1 },
  { name: "Jigme", fid: "02210012", contact: "17324560", address: "Haa", systemId: 2 },
  { name: "Pema", fid: "02210124", contact: "77543729", address: "Paro", systemId: 1 },
  { name: "Tshering", fid: "02210134", contact: "77543729", address: "Paro", systemId: 1 },
];

const FarmersPage: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [anchorElAddress, setAnchorElAddress] = useState<null | HTMLElement>(null);
  const [anchorElSystem, setAnchorElSystem] = useState<null | HTMLElement>(null);
  const [farmersData, setFarmersData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editFarmer, setEditFarmer] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [farmerToDelete, setFarmerToDelete] = useState<null | number>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedSystemId, setSelectedSystemId] = useState<number | null>(null);

  useEffect(() => {
    const storedFarmers = JSON.parse(localStorage.getItem("farmersData") || "[]");
    if (storedFarmers.length === 0) {
      localStorage.setItem("farmersData", JSON.stringify(initialFarmersData));
    }
    setFarmersData(storedFarmers.length > 0 ? storedFarmers : initialFarmersData);
  }, []);

  const handleAddNewMember = () => {
    router.push("/components/dashboard/AddMember"); // Correct path to match the new location
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleAddressFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAddress(event.currentTarget);
  };

  const handleFarmersCardClick = () => {
    router.push("/components/System");
  };

  const handleAnimalsClick = () => {
    router.push('/components/Animals'); // Redirect to the farmers page
  };

  const handleSystemFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSystem(event.currentTarget);
  };

  const handleAddressFilterClose = (address: string | null) => {
    setSelectedAddress(address);
    setAnchorElAddress(null);
  };

  const handleSystemFilterClose = (systemId: number | null) => {
    setSelectedSystemId(systemId);
    setAnchorElSystem(null);
  };

  const handleEdit = (index: number) => {
    setEditFarmer({ ...farmersData[index], index });
  };

  const handleDelete = (index: number) => {
    setFarmerToDelete(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (farmerToDelete !== null) {
      setFarmersData((prev) => prev.filter((_, i) => i !== farmerToDelete));
    }
    setDeleteDialogOpen(false);
    setFarmerToDelete(null);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedAddress(null);
    setSelectedSystemId(null);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditFarmer((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSave = () => {
    const updatedFarmers = [...farmersData];
    updatedFarmers[editFarmer.index] = { ...editFarmer };
    setFarmersData(updatedFarmers);
    setEditFarmer(null); // Close the edit dialog
  };

  const filteredFarmers = farmersData.filter((farmer) => {
    const matchesSearch = farmer.name.toLowerCase().includes(search.toLowerCase());
    const matchesAddress = selectedAddress ? farmer.address === selectedAddress : true;
    const matchesSystemId = selectedSystemId ? farmer.systemId === selectedSystemId : true;
    return matchesSearch && matchesAddress && matchesSystemId;
  });

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{ padding: 2, textAlign: "center", borderRadius: "12px", backgroundColor: "#b0e892" }} >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 1 }}>
              <DevicesIcon sx={{ fontSize: 35, color: "#027c68", marginRight: 1 }} />
              <Typography variant="body1" fontWeight="bold">Number of Systems</Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="h5" fontWeight="bold">2000</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{ padding: 2, textAlign: "center", borderRadius: "12px", backgroundColor: "#b0e892" }} onClick={handleAnimalsClick}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 1 }}>
              <PetsIcon sx={{ fontSize: 35, color: "#027c68", marginRight: 1 }} />
              <Typography variant="body1" fontWeight="bold">Total Number of Animals Detected</Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="h5" fontWeight="bold">2500</Typography>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 5, padding: 2, backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h6" fontWeight="bold" color="forestgreen" sx={{ marginBottom: 2 }}>Number of Farmers</Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2, gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleAddressFilterClick}
              sx={{ borderColor: "#99cc66", color: "black", borderRadius: "8px", "&:hover": { backgroundColor: "#f4f8f1" } }}
            >
              Address
            </Button>
            <Menu
              anchorEl={anchorElAddress}
              open={Boolean(anchorElAddress)}
              onClose={() => handleAddressFilterClose(null)}
            >
              {['Paro', 'Haa', 'Thimphu', 'Chhukha', 'Tsirang', 'Bumthang'].map((address) => (
                <MenuItem key={address} onClick={() => handleAddressFilterClose(address)}>{address}</MenuItem>
              ))}
            </Menu>

            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleSystemFilterClick}
              sx={{ borderColor: "#99cc66", color: "black", borderRadius: "8px", "&:hover": { backgroundColor: "#f4f8f1" } }}
            >
              System ID
            </Button>
            <Menu
              anchorEl={anchorElSystem}
              open={Boolean(anchorElSystem)}
              onClose={() => handleSystemFilterClose(null)}
            >
              {[1, 2, 3].map((id) => (
                <MenuItem key={id} onClick={() => handleSystemFilterClose(id)}>{id}</MenuItem>
              ))}
            </Menu>

            <Button
              variant="outlined"
              onClick={resetFilters}
              sx={{ borderColor: "#99cc66", color: "black", borderRadius: "8px", "&:hover": { backgroundColor: "#f4f8f1" } }}
            >
              Reset Filters
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push("/components/dashboard/AddMember")}
              sx={{
                backgroundColor: "#99cc66",
                color: "#fff",
                borderRadius: "8px",
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
                width: "40%",
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

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>NAME</strong></TableCell>
                <TableCell><strong>FID</strong></TableCell>
                <TableCell><strong>CONTACT NO</strong></TableCell>
                <TableCell><strong>ADDRESS</strong></TableCell>
                <TableCell><strong>SYSTEM ID</strong></TableCell>
                <TableCell><strong>ACTION</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFarmers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((farmer, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ marginRight: 1, backgroundColor: "#99cc66" }}>{farmer.name.charAt(0)}</Avatar>
                      {farmer.name}
                    </Box>
                  </TableCell>
                  <TableCell>{farmer.fid}</TableCell>
                  <TableCell>{farmer.contact}</TableCell>
                  <TableCell>{farmer.address}</TableCell>
                  <TableCell>{farmer.systemId}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <EditIcon sx={{ cursor: "pointer", color: "#027c68" }} onClick={() => handleEdit(index)} />
                      <DeleteIcon sx={{ cursor: "pointer", color: "#d32f2f" }} onClick={() => handleDelete(index)} />
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
        />

        {/* Edit Farmer Dialog */}
        <Dialog open={Boolean(editFarmer)} onClose={() => setEditFarmer(null)}>
          <DialogTitle sx={{ color: "forestgreen", fontWeight: "bold"}}>Edit Farmer</DialogTitle>
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
              label="FID"
              variant="outlined"
              value={editFarmer?.fid || ""}
              onChange={(e) => handleEditChange("fid", e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Contact"
              variant="outlined"
              value={editFarmer?.contact || ""}
              onChange={(e) => handleEditChange("contact", e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Address"
              variant="outlined"
              value={editFarmer?.address || ""}
              onChange={(e) => handleEditChange("address", e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="System ID"
              variant="outlined"
              type="number"
              value={editFarmer?.systemId || ""}
              onChange={(e) => handleEditChange("systemId", e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditFarmer(null)} color="primary">Cancel</Button>
            <Button onClick={handleEditSave} color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this farmer?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
            <Button onClick={confirmDelete} color="secondary">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default FarmersPage;
