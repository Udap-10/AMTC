"use client";

import PageContainer from "@/app/DashboardLayout/components/container/PageContainer";
import DeleteIcon from "@mui/icons-material/Close";
import {
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useEffect, useState } from "react";

interface System {
  _id: string;
  systemID: string;
  systemName: string;
  owner?: {
    CID: string;
    name: string;
  };
}

interface FarmerGroup {
  CID: string;
  name: string;
  systems: {
    systemID: string;
    systemName: string;
  }[];
}

const SystemLinkedFarmersPage = () => {
  const [data, setData] = useState<FarmerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchSystemDetails = async () => {
    try {
      const res = await axios.get("/api/SystemRequest");
      const systems: System[] = res.data.data;

      const grouped: { [key: string]: FarmerGroup } = {};

      systems.forEach((sys) => {
        if (sys.owner && sys.owner.CID && sys.owner.name) {
          const key = sys.owner.CID;
          if (!grouped[key]) {
            grouped[key] = {
              CID: sys.owner.CID,
              name: sys.owner.name,
              systems: [],
            };
          }
          grouped[key].systems.push({
            systemID: sys.systemID,
            systemName: sys.systemName,
          });
        }
      });

      setData(Object.values(grouped));
    } catch (err) {
      console.error("Error fetching system details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (systemID: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this system?"
    );
    if (!confirm) return;

    try {
      const res = await axios.delete(`/api/SystemRequest?id=${systemID}`);
      if (res.data.success) {
        setSnackbarMessage("System deleted successfully!");
      } else {
        setSnackbarMessage("System deletion failed.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setSnackbarMessage("Failed to delete system.");
    } finally {
      setSnackbarOpen(true);
      fetchSystemDetails(); // Refresh data
    }
  };

  useEffect(() => {
    fetchSystemDetails();
  }, []);

  return (
    <PageContainer
      title="Linked Systems per Farmer"
      description="Displays which systems are linked to which farmers"
    >
      <Typography
        variant="h5"
        sx={{
          color: "forestgreen",
          fontWeight: "bold",
          mb: 3,
          textAlign: "left",
        }}
      >
        System Owner
      </Typography>

      {loading ? (
        <Grid container justifyContent="center" mt={5}>
          <CircularProgress />
        </Grid>
      ) : data.length === 0 ? (
        <Typography align="center" mt={3}>
          No linked systems found.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: 4 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#d0f5d0" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#004d40" }}>
                  CID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#004d40" }}>
                  Farmer Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#004d40" }}>
                  Systems
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((farmer, index) => (
                <TableRow key={index}>
                  <TableCell>{farmer.CID}</TableCell>
                  <TableCell>{farmer.name}</TableCell>
                  <TableCell>
                    <Grid container spacing={1}>
                      {farmer.systems.map((sys, i) => (
                        <Grid
                          item
                          key={i}
                          sx={{
                            position: "relative",
                            "&:hover .delete-icon": {
                              display: "flex",
                            },
                          }}
                        >
                          <Tooltip
                            title={
                              <>
                                <Typography variant="subtitle2">
                                  <strong>Name:</strong>{" "}
                                  {sys.systemName || "N/A"}
                                </Typography>
                                <Typography variant="subtitle2">
                                  <strong>ID:</strong> {sys.systemID}
                                </Typography>
                              </>
                            }
                            arrow
                          >
                            <Chip
                              label={sys.systemName || "Unnamed"}
                              color="success"
                              variant="outlined"
                              sx={{
                                fontWeight: "bold",
                                borderRadius: "20px",
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>

                          <IconButton
                            size="small"
                            className="delete-icon"
                            onClick={() => handleDelete(sys.systemID)}
                            sx={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              backgroundColor: "#fff",
                              border: "1px solid #ccc",
                              display: "none",
                              zIndex: 10,
                              padding: "2px",
                              "&:hover": {
                                backgroundColor: "#ffe6e6",
                              },
                            }}
                          >
                            <DeleteIcon
                              fontSize="small"
                              sx={{ color: "red" }}
                            />
                          </IconButton>
                        </Grid>
                      ))}
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </PageContainer>
  );
};

export default SystemLinkedFarmersPage;
