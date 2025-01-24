'use client';

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PetsIcon from "@mui/icons-material/Pets";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { SelectChangeEvent } from "@mui/material";

const SystemsPage: React.FC = () => {
  const router = useRouter();

  const handleFarmersCardClick = () => {
    router.push('/DashboardLayout/components/farmers');
  };

  const handleAnimalsCardClick = () => {
    router.push('/DashboardLayout/components/Animals');
  };
  
  // State for table pagination
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // State for the table data
  const [tableData, setTableData] = useState(
    Array.from({ length: 20 }).map((_, index) => ({
      systemId: `SYS-${index + 1}`,
      farmerId: `FID-${index + 1}`,
      camera: "Yes",
      raspberryPi: `Model-${index + 1}`,
      gsm: "Active",
      initialDate: `2025-01-${(index % 30) + 1}`,
    }))
  );

  // State for dialogs
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // State for current row operations
  const [currentSystem, setCurrentSystem] = useState({
    systemId: "",
    farmerId: "",
    camera: "Yes",
    raspberryPi: "",
    gsm: "Active",
    initialDate: "",
  });

  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);

  // Handle table pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle dialog input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentSystem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCurrentSystem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open Add/Edit Dialog
  const handleAddNewSystem = () => {
    setCurrentSystem({
      systemId: "",
      farmerId: "",
      camera: "Yes",
      raspberryPi: "",
      gsm: "Active",
      initialDate: "",
    });
    setSelectedRowIndex(null);
    setOpenAddEditDialog(true);
  };

  const handleEditRow = (index: number) => {
    setSelectedRowIndex(index);
    setCurrentSystem({ ...tableData[index] });
    setOpenAddEditDialog(true);
  };

  const handleSubmitSystem = () => {
    if (selectedRowIndex !== null) {
      // Update existing row
      setTableData((prevData) =>
        prevData.map((row, index) =>
          index === selectedRowIndex ? { ...currentSystem } : row
        )
      );
    } else {
      // Add new row
      setTableData((prevData) => [...prevData, currentSystem]);
    }
    setOpenAddEditDialog(false);
  };

  // Open Delete Dialog
  const handleDeleteRow = (index: number) => {
    setRowToDelete(index);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteRow = () => {
    if (rowToDelete !== null) {
      setTableData((prevData) => prevData.filter((_, i) => i !== rowToDelete));
      setRowToDelete(null);
    }
    setOpenDeleteDialog(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        <Grid item xs={4}>
          <Card
            elevation={3}
            sx={{
              padding: 2,
              textAlign: "center",
              borderRadius: "12px",
              backgroundColor: "#b0e892",
              cursor: "pointer",
            }}
            onClick={handleFarmersCardClick}
          >
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
              <PeopleIcon sx={{ fontSize: 35, color: "#027c68", marginBottom: 1 }} />
              <Typography variant="body1" fontWeight="bold" sx={{ marginLeft: 2 }}>
                Number of Farmers
              </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="h5" fontWeight="bold">2000</Typography>
          </Card>
        </Grid>
        <Grid item xs={4}>
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
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
              <PetsIcon sx={{ fontSize: 35, color: "#027c68", marginBottom: 1 }} />
              <Typography variant="body1" fontWeight="bold" sx={{ marginLeft: 2 }}>
                Total number of Animals Detected
              </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="h5" fontWeight="bold">2500</Typography>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewSystem}
          sx={{
            backgroundColor: "#99cc66",
            color: "#fff",
            "&:hover": { backgroundColor: "#025c54" },
          }}
        >
          Add New System
        </Button>
      </Box>

      <Card elevation={3} sx={{ padding: 3, borderRadius: "12px" }}>
        <Typography variant="h6" fontWeight="bold" color="forestgreen" sx={{ marginBottom: 2 }}>
          System Information
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
            <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>System ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>CID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Camera</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Raspberry Pi</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>GSM</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Initial Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
              {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.systemId}</TableCell>
                  <TableCell>{row.farmerId}</TableCell>
                  <TableCell>{row.camera}</TableCell>
                  <TableCell>{row.raspberryPi}</TableCell>
                  <TableCell>{row.gsm}</TableCell>
                  <TableCell>{row.initialDate}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditRow(index)} sx={{ color: "#027c68" }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRow(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]} // Disables the rows-per-page dropdown
        labelRowsPerPage=""     // Removes the "Rows per page" text
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openAddEditDialog} onClose={() => setOpenAddEditDialog(false)}>
        <DialogTitle sx={{ color: "forestgreen", fontWeight: "bold" }}>{selectedRowIndex !== null ? "Edit System" : "Add New System"}</DialogTitle>
        <DialogContent>
          <TextField name="systemId" label="System ID" value={currentSystem.systemId} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField name="farmerId" label="CID" value={currentSystem.farmerId} onChange={handleInputChange} fullWidth margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Camera</InputLabel>
            <Select name="camera" value={currentSystem.camera} onChange={handleSelectChange} label="Camera">
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <TextField name="raspberryPi" label="Raspberry Pi" value={currentSystem.raspberryPi} onChange={handleInputChange} fullWidth margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel>GSM</InputLabel>
            <Select name="gsm" value={currentSystem.gsm} onChange={handleSelectChange} label="GSM">
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField name="initialDate" label="Initial Date" value={currentSystem.initialDate} onChange={handleInputChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitSystem} 
            variant="contained" 
            color="primary" 
            sx={{ backgroundColor: '#99cc66', '&:hover': { backgroundColor: '#9cd57d' } }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this system?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteRow} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SystemsPage;
