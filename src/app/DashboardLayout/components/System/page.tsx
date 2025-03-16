"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import PetsIcon from "@mui/icons-material/Pets";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SystemsPage: React.FC = () => {
  const router = useRouter();

  const handleFarmersCardClick = () => {
    router.push("/DashboardLayout/components/farmers");
  };

  const handleAnimalsCardClick = () => {
    router.push("/DashboardLayout/components/Animals");
  };

  const locationData: { [key: string]: string[] } = {
    Bumthang: ["Chhoekhor", "Chhume", "Tang", "Ura"],
    Chhukha: [
      "Bongo",
      "Chapcha",
      "Darla",
      "Dungna",
      "Geling",
      "Getena",
      "Lokchina",
      "Metakha",
      "Phuentsholing",
      "Sampheling",
    ],
    Dagana: [
      "Dorona",
      "Gesarling",
      "Gozhi",
      "Kana",
      "Khebisa",
      "Lajab",
      "Nichula",
      "Tseza",
      "Tsangkha",
      "Tshendagang",
      "Tseza",
    ],
    Gasa: ["Goenkhamey", "Goenkhatoe", "Laya", "Lunana"],
    Haa: ["Bji", "Gakiling", "Katsho", "Samar", "Sangbay", "Uesu"],
    Lhuentse: [
      "Gangzur",
      "Jarey",
      "Khoma",
      "Kurtoe",
      "Menbi",
      "Metsho",
      "Mingkhar",
      "Tsenkhar",
    ],
    Mongar: [
      "Balam",
      "Chaskhar",
      "Chhali",
      "Drametse",
      "Drepung",
      "Gongdue",
      "Jurmey",
      "Kengkhar",
      "Mongar",
      "Narang",
      "Ngatshang",
      "Saleng",
      "Shermung",
      "Silambi",
      "Thangrong",
      "Tsamang",
    ],
    Paro: [
      "Doga",
      "Doteng",
      "Hungrel",
      "Lamgong",
      "Lungnyi",
      "Naja",
      "Shaba",
      "Tsento",
      "Wangchang",
      "Shari",
    ],
    Pemagatshel: [
      "Chhimung",
      "Choekhorling",
      "Chongshing",
      "Dechheling",
      "Dungmin",
      "Khar",
      "Nanong",
      "Norbugang",
      "Shumar",
      "Yurung",
      "Zobel",
    ],
    Punakha: [
      "Chhubu",
      "Dzome",
      "Goenshari",
      "Guma",
      "Kabjisa",
      "Lingmukha",
      "Shenga Bjemi",
      "Talo",
      "Toewang",
      "Toedwang",
    ],
    SamdrupJongkhar: [
      "Dewathang",
      "Gomdar",
      "Langchenphu",
      "Lauri",
      "Martshala",
      "Orong",
      "Pemathang",
      "Phuntshothang",
      "Samrang",
      "Serthi",
      "Wangphu",
    ],
    Samtse: [
      "Bara",
      "Biru",
      "Chahukha",
      "Denchukha",
      "Dophuchen",
      "Dungtoe",
      "Gomtu",
      "Namgaycholing",
      "Norgaygang",
      "Phuentshogpelri",
      "Samtse",
      "Tading",
      "Tendruk",
      "Ugyentse",
      "Yoeseltse",
    ],
    Sarpang: [
      "Bhur",
      "Chhuzagang",
      "Dekiling",
      "Gelephu",
      "Jigmecholing",
      "Samtenling",
      "Serzhong",
      "Shompangkha",
      "Tareythang",
      "Umling",
    ],
    Thimphu: [
      "Kawang",
      "Chang",
      "Dagala",
      "Genye",
      "Lingzhi",
      "Mewang",
      "Naro",
      "Soe",
    ],
    Trashigang: [
      "Bartsham",
      "Bidung",
      "Kanglung",
      "Kangpara",
      "Khaling",
      "Lumang",
      "Merak",
      "Phongmey",
      "Radhi",
      "Sakten",
      "Samkhar",
      "Shongphu",
      "Thrimshing",
      "Uzorong",
      "Yangnyer",
    ],
    Trashiyangtse: [
      "Bumdeling",
      "Jamkhar",
      "Khamdang",
      "Ramjar",
      "Toetsho",
      "Tomzhangtshen",
      "Yangtse",
      "Yalang",
    ],
    Trongsa: ["Drakteng", "Korphu", "Langthil", "Nubi", "Tangsibji"],
    Tsirang: [
      "Barzhong",
      "Goserling",
      "Kikhorthang",
      "Mendrelgang",
      "Patala",
      "Phuntenchhu",
      "Rangthangling",
      "Semjong",
      "Tsholingkhar",
      "Tsirangtoe",
      "Dunglagang",
      "Tsholingkhar",
    ],
    WangduePhodrang: [
      "Athang",
      "Bjena",
      "Daga",
      "Dangchu",
      "Gangte",
      "Gasetsho Gom",
      "Gasetsho Wom",
      "Nahi",
      "Nyisho",
      "Phangyul",
      "Sephu",
      "Thedtsho",
      "Ruepisa",
    ],
    Zhemgang: [
      "Bardo",
      "Bjoka",
      "Goshing",
      "Nangkor",
      "Ngangla",
      "Phangkhar",
      "Shingkhar",
      "Trong",
    ],
  };

  // State for table pagination
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // State for the table data
  const [tableData, setTableData] = useState(
    Array.from({ length: 20 }).map((_, index) => ({
      systemID: `SYS-${index + 1}`,
      systemName: `FID-${index + 1}`,
      password: "",
      location: "",
      macAddress: "",
      installationDate: new Date().toISOString(),
    }))
  );
  const [farmersData, setFarmersData] = useState<any[]>([]);
  const [animalData, setAnimalData] = useState<any[]>([]);

  // State for dialogs
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // State for current row operations
  const [currentSystem, setCurrentSystem] = useState({
    systemID: "",
    systemName: "",
    password: "",
    location: "",
    macAddress: "",
    installationDate: "",
  });

  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);

  // Fetch systems data from API
  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    const res = await fetch("/api/System");
    const data = await res.json();
    setTableData(data);
  };
  useEffect(() => {
    const fetchFarmersData = async () => {
      try {
        const response = await fetch("/api/Farmer");
        const data = await response.json();
        setFarmersData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching farmers data:", error);
      }
    };
    fetchFarmersData();
  }, []);

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

  // Handle table pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle dialog input changes
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
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
      systemID: "",
      systemName: "",
      password: "",
      location: "",
      macAddress: "",
      installationDate: "",
    });
    setSelectedRowIndex(null);
    setOpenAddEditDialog(true);
  };

  const handleEditRow = (index: number) => {
    setSelectedRowIndex(index);

    const selectedSystem = tableData[index];

    setCurrentSystem({
      ...selectedSystem,
      location: selectedSystem.location || "",
      macAddress: selectedSystem.macAddress || "",
      password: selectedSystem.password || "",
    });
    setOpenAddEditDialog(true);
  };

  const handleSubmitSystem = async () => {
    if (!currentSystem) return;

    const isEditing = selectedRowIndex !== null;
    const systemID = currentSystem.systemID;

    // If you're not manually selecting installationDate, don't include it
    const systemData = {
      systemName: currentSystem.systemName,
      location: currentSystem.location,
      macAddress: currentSystem.macAddress,
      password: currentSystem.password,
      // Optional: Include only if you want to send it explicitly
      // installationDate: currentSystem.installationDate
    };

    try {
      let response;
      let data;

      if (isEditing) {
        // Editing existing system
        response = await fetch(`/api/System?systemID=${systemID}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(systemData),
        });

        data = await response.json();

        if (response.ok) {
          setTableData((prevData) =>
            prevData.map((row, index) =>
              index === selectedRowIndex ? { ...row, ...systemData } : row
            )
          );
          alert("✅ System updated successfully!");
        } else {
          console.error("Error updating system:", data.message);
          alert(`❌ ${data.message}`);
        }
      } else {
        // Adding a new system
        response = await fetch("/api/System", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ systemID, ...systemData }),
        });

        data = await response.json();

        if (response.ok) {
          setTableData((prevData) => [
            ...prevData,
            {
              systemID,
              ...systemData,
              installationDate: new Date().toISOString(),
            },
          ]);
          alert("✅ New system added successfully!");
        } else {
          console.error("Error adding system:", data.message);
          alert(`❌ ${data.message}`);
        }
      }

      setOpenAddEditDialog(false);
    } catch (error) {
      console.error("Request failed:", error);
      alert("❌ An error occurred. Please try again.");
    }
  };

  // Open Delete Dialog
  const handleDeleteRow = (index: number) => {
    setRowToDelete(index);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteRow = async () => {
    if (rowToDelete !== null) {
      const systemID = tableData[rowToDelete].systemID; // Get the systemID of the row to delete

      try {
        // Send DELETE request to the backend
        const response = await fetch(`/api/System?systemID=${systemID}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (response.ok) {
          // If the deletion was successful, remove the row from the table data
          setTableData((prevData) =>
            prevData.filter((_, i) => i !== rowToDelete)
          );
          setRowToDelete(null);
          alert("✅ System deleted successfully!"); // Success message
        } else {
          console.error("Error:", data.message);
          alert(data.message); // Show error message to the user
        }
      } catch (error) {
        console.error("Request failed", error);
        alert("An error occurred. Please try again.");
      }
    }

    setOpenDeleteDialog(false);
  };

  function dayjs(installationDate: string): unknown {
    throw new Error("Function not implemented.");
  }

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
            <Box
              sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
            >
              <PeopleIcon
                sx={{ fontSize: 35, color: "#027c68", marginBottom: 1 }}
              />
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ marginLeft: 2 }}
              >
                Number of Farmers
              </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              {farmersData.length}
            </Typography>
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
            <Box
              sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
            >
              <PetsIcon
                sx={{ fontSize: 35, color: "#027c68", marginBottom: 1 }}
              />
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ marginLeft: 2 }}
              >
                Total number of Animals Detected
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
        sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}
      >
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
        <Typography
          variant="h6"
          fontWeight="bold"
          color="forestgreen"
          sx={{ marginBottom: 2 }}
        >
          System Information
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>System ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>System Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>MAC Address</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Installation Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.systemID}</TableCell>
                    <TableCell>{row.systemName}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.macAddress}</TableCell>
                    <TableCell>{row.installationDate.split("T")[0]}</TableCell>

                    <TableCell>
                      <IconButton
                        onClick={() => handleEditRow(index)}
                        sx={{ color: "#027c68" }}
                      >
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
          labelRowsPerPage="" // Removes the "Rows per page" text
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openAddEditDialog}
        onClose={() => setOpenAddEditDialog(false)}
      >
        <DialogTitle sx={{ color: "forestgreen", fontWeight: "bold" }}>
          {selectedRowIndex !== null ? "Edit System" : "Add New System"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="systemID"
            label="System ID"
            value={currentSystem.systemID}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="systemName"
            label="System Name"
            value={currentSystem.systemName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            value={currentSystem.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Location</InputLabel>
            <Select
              name="location"
              value={currentSystem.location}
              onChange={handleSelectChange}
              label="Location"
            >
              {Object.entries(locationData).map(([dzongkhag, gewogs]) =>
                gewogs.map((gewog) => (
                  <MenuItem
                    key={`${dzongkhag}-${gewog}`}
                    value={`${dzongkhag} - ${gewog}`}
                  >
                    {dzongkhag} - {gewog}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            name="macAddress"
            label="MAC Address"
            value={currentSystem.macAddress}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="installationDate"
            label="Initial Date"
            type="date"
            value={currentSystem.installationDate.split("T")[0]}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitSystem}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#99cc66",
              "&:hover": { backgroundColor: "#9cd57d" },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
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
