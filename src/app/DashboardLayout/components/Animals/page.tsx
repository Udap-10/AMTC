"use client";
import DevicesIcon from "@mui/icons-material/Devices";
import PeopleIcon from "@mui/icons-material/People";
import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AnimalsPage: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [animalData, setAnimalData] = useState<any[]>([]);
  const [currentMonthData, setCurrentMonthData] = useState<any[]>([]);
  const [farmersData, setFarmersData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [animalTypesData, setAnimalTypesData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const fixedAnimalTypes = [
    "Bear",
    "Boar",
    "Cattle",
    "Deer",
    "Elephant",
    "Horse",
    "Monkey",
    "Raccoon",
  ];

  const populatedChartData = fixedAnimalTypes.map((animal) => {
    const match = animalTypesData.find((item) => item.name === animal);
    return {
      name: animal,
      count: match ? match.count : 0,
    };
  });

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await fetch(`/api/Animals?year=${selectedYear}`);
        const data = await response.json();

        if (data.success) {
          const animals = data.animals;

          const formattedData = animals.map((animal: any) => ({
            date: new Date(animal.Date).toLocaleDateString("en-GB"),
            animalsDetected: 1,
          }));

          setAnimalData(formattedData);
          setCurrentMonthData(formattedData); // Assuming you want to set monthwise view too

          const formattedAnimalTypesData = animals.reduce(
            (acc: any[], animal: any) => {
              const existing = acc.find((item) => item.name === animal.name);
              if (existing) {
                existing.count += 1;
              } else {
                acc.push({ name: animal.name, count: 1 });
              }
              return acc;
            },
            []
          );
          setAnimalTypesData(formattedAnimalTypesData);
        } else {
          console.error("Failed to fetch animals:", data.message);
        }
      } catch (error) {
        console.error("Error fetching animal data:", error);
      }
    };

    fetchAnimalData();
  }, [selectedYear]); // <-- key change

  useEffect(() => {
    const fetchFarmersData = async () => {
      try {
        const response = await fetch("/api/Farmer");
        const data = await response.json();
        setFarmersData(data);
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

  const handleFarmersCardClick = () => {
    router.push("/DashboardLayout/components/farmers");
  };

  const handleSystemsCardClick = () => {
    router.push("/DashboardLayout/components/System");
  };

  const handlePrevious = () => {
    setSelectedYear((prevYear) => prevYear - 1);
  };

  const handleNext = () => {
    setSelectedYear((prevYear) => prevYear + 1);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={3}
            sx={{
              padding: 2,
              textAlign: "center",
              borderRadius: "12px",
              backgroundColor: "#b0e892",
              minHeight: "150px",
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
            <Divider sx={{ position: "relative", marginY: 1, height: "0px" }} />
            <Typography variant="h5" fontWeight="bold" sx={{ marginLeft: 20 }}>
              {farmersData.length}
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
              minHeight: "150px",
            }}
            onClick={handleSystemsCardClick}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
            >
              <DevicesIcon
                sx={{ fontSize: 35, color: "#027c68", marginBottom: 1 }}
              />
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ marginLeft: 2 }}
              >
                Number of Systems
              </Typography>
            </Box>
            <Divider sx={{ position: "relative", marginY: 1, height: "0px" }} />
            <Typography variant="h5" fontWeight="bold" sx={{ marginLeft: 20 }}>
              {tableData.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ padding: 5, borderRadius: "12px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="forestgreen">
                  Animal Detection by Type
                </Typography>
              </Box>

              {/* Year Navigation on the right */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "flex-start", // 👈 Add this
                }}
              >
                <IconButton
                  onClick={handlePrevious}
                  sx={{ color: "#027c68", fontSize: 28, fontWeight: "bold" }}
                >
                  &lt;
                </IconButton>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ fontSize: 20 }}
                >
                  {selectedYear}
                </Typography>
                <IconButton
                  onClick={handleNext}
                  sx={{ color: "#027c68", fontSize: 28, fontWeight: "bold" }}
                >
                  &gt;
                </IconButton>
              </Box>
            </Box>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={populatedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  label={{
                    value: "Animals",
                    position: "insideBottom",
                    offset: -5,
                    style: { fill: "#000", fontWeight: "bold" }, // dark and bold
                  }}
                />
                <YAxis
                  label={{
                    value: "Count",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                    style: { fill: "#000", fontWeight: "bold" }, // dark and bold
                  }}
                />

                <Tooltip />
                <Bar dataKey="count" fill="#027c68" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: "12px",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#000000",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                marginBottom: 2,
                color: isDarkMode ? "#90caf9" : "forestgreen",
              }}
            >
              Animal Detection Summary
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: isDarkMode ? "#2a2a2a" : "#f9f9f9",
                maxWidth: "600px",
                margin: "auto",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: isDarkMode ? "#333" : "#d3f4cd",
                    }}
                  >
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                      }}
                    >
                      Animal Type
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Total Count
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {animalTypesData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        align="center"
                        sx={{ borderRight: "1px solid #ccc" }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnimalsPage;
function setSelectedYear(arg0: (prevYear: any) => number) {
  throw new Error("Function not implemented.");
}
