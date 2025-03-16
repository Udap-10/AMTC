"use client";

import PageContainer from "@/app/DashboardLayout/components/container/PageContainer";
import DashboardCard from "@/app/DashboardLayout/components/shared/DashboardCard";
import { Delete, Edit } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Pagination,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

interface AnimalCategory {
  slNo: number;
  animal: string;
  description: string;
}

const LabelsAnimalsPage = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [animalCategories, setAnimalCategories] = useState<AnimalCategory[]>(
    []
  );
  const [slNo, setSlNo] = useState("");
  const [newAnimal, setNewAnimal] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedSlNo, setSelectedSlNo] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/AnimalCategory");
      const json = await res.json();
      if (res.ok && json.success) {
        setAnimalCategories(json.data);
      } else {
        console.error("Failed to fetch categories", json.message);
      }
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpen = () => {
    setSlNo((animalCategories.length + 1).toString());
    setNewAnimal("");
    setNewDescription("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditIndex(null);
  };

  const handleAddOrUpdateAnimal = async () => {
    if (newAnimal && newDescription && slNo) {
      const duplicateSlNo = animalCategories.some(
        (category, index) =>
          category.slNo === parseInt(slNo) && index !== editIndex
      );

      const duplicateAnimal = animalCategories.some(
        (category, index) =>
          category.animal.toLowerCase() === newAnimal.toLowerCase() &&
          index !== editIndex
      );

      if (duplicateSlNo && editIndex === null) {
        alert("Sl No already exists. Please use a different Sl No.");
        return;
      }

      if (duplicateAnimal && editIndex === null) {
        alert("Animal already exists. Please use a different name.");
        return;
      }

      if (editIndex !== null) {
        // Edit mode — Call PATCH API using slNo
        try {
          const res = await fetch("/api/AnimalCategory", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slNo: parseInt(slNo),
              animal: newAnimal,
              description: newDescription,
            }),
          });

          const data = await res.json();
          if (res.ok && data.success) {
            const updatedCategories = [...animalCategories];
            updatedCategories[editIndex] = {
              slNo: parseInt(slNo),
              animal: newAnimal,
              description: newDescription,
            };
            setAnimalCategories(updatedCategories);
            setSuccessMessage("Animal category updated successfully!");
            setOpenSnackbar(true);
          } else {
            alert("Failed to update category: " + data.message);
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong while updating the animal category.");
        }
      } else {
        // Add mode — POST
        try {
          const res = await fetch("/api/AnimalCategory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slNo: parseInt(slNo),
              animal: newAnimal,
              description: newDescription,
            }),
          });

          const data = await res.json();
          if (res.ok && data.success) {
            setSuccessMessage("Animal category added successfully!");
            setOpenSnackbar(true);
            setAnimalCategories([
              ...animalCategories,
              {
                slNo: parseInt(slNo),
                animal: newAnimal,
                description: newDescription,
              },
            ]);
          } else {
            alert("Failed to add category: " + data.message);
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong while adding the animal category.");
        }
      }

      handleClose();
    }
  };

  const handleEdit = (index: number) => {
    const selected = animalCategories[index];
    setSlNo(selected.slNo.toString());
    setNewAnimal(selected.animal);
    setNewDescription(selected.description);
    setEditIndex(index);
    setOpen(true);
  };

  const confirmDelete = (slNo: number) => {
    setSelectedSlNo(slNo);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSlNo === null) return;
    try {
      const res = await fetch("/api/AnimalCategory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slNo: selectedSlNo }),
      });
      const result = await res.json();
      if (result.success) {
        setSuccessMessage("Animal category deleted successfully!");
        setOpenSnackbar(true);
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to delete category", error);
    } finally {
      setOpenConfirmDialog(false);
      setSelectedSlNo(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setSelectedSlNo(null);
  };

  // Pagination logic
  const rowsPerPage = 6;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(animalCategories.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const handlePageChange = (_: any, value: number) => setPage(value);

  return (
    <PageContainer
      title="Labels and Animals"
      description="A table representation of animals and their descriptions."
    >
      <DashboardCard>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mb={2}
          >
            <Typography variant="h5" fontWeight="bold" color="forestgreen">
              Animal Category
            </Typography>
            <Button variant="contained" color="success" onClick={handleOpen}>
              Add Animal Category
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              maxWidth: 900,
              margin: "auto",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#2d6a4f" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    SL.NO
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Animal
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {animalCategories
                  .slice(startIndex, endIndex)
                  .map((item, index) => (
                    <TableRow
                      key={startIndex + index}
                      sx={{
                        backgroundColor:
                          index % 2 === 0
                            ? theme.palette.action.hover
                            : "inherit",
                      }}
                    >
                      <TableCell>{item.slNo}</TableCell>
                      <TableCell>{item.animal}</TableCell>
                      <TableCell
                        sx={{
                          fontStyle: "italic",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {item.description}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(startIndex + index)}
                            sx={{ mr: 1 }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => confirmDelete(item.slNo)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box mt={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Box>
      </DashboardCard>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "forestgreen", fontWeight: "bold" }}>
          {editIndex !== null
            ? "Edit Animal Information"
            : "Add Animal Information"}
        </DialogTitle>
        <DialogContent
          sx={{ backgroundColor: theme.palette.background.default, padding: 3 }}
        >
          <FormControl fullWidth margin="dense" variant="outlined">
            <TextField
              label="SL.No"
              type="number"
              fullWidth
              margin="dense"
              value={slNo}
              onChange={(e) => setSlNo(e.target.value)}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </FormControl>
          <FormControl fullWidth margin="dense" variant="outlined">
            <TextField
              label="Animal Name"
              fullWidth
              value={newAnimal}
              onChange={(e) => setNewAnimal(e.target.value)}
            />
          </FormControl>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={5}
            margin="dense"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdateAnimal} color="success">
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this animal category?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default LabelsAnimalsPage;
