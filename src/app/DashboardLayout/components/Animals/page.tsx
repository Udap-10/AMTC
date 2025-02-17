"use client";
import DevicesIcon from "@mui/icons-material/Devices";
import PeopleIcon from "@mui/icons-material/People";
import { Box, Card, Divider, Grid, Typography, useTheme } from "@mui/material";
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
  const [animalTypesData, setAnimalTypesData] = useState<any[]>([]); // State for animal types chart data

  // Fetch animal detection data from the backend
  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await fetch("/api/Animals");
        const data = await response.json();

        if (data.success) {
          const animals = data.animals;

          // Formatting the data for animal detections (by full date)
          const formattedData = animals.map((animal: any) => ({
            date: new Date(animal.Date).toLocaleDateString("en-GB"), // Format as DD/MM/YYYY (can customize as needed)
            animalsDetected: 1, // For simplicity, assuming one animal per record
          }));

          setAnimalData(formattedData);
          setCurrentMonthData(formattedData);

          // Formatting data for the animal types chart
          const formattedAnimalTypesData = animals.reduce(
            (acc: any[], animal: any) => {
              const existing = acc.find((item) => item.name === animal.name);
              if (existing) {
                existing.count += 1; // Increment the count for this animal type
              } else {
                acc.push({ name: animal.name, count: 1 }); // Add new animal type
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
  }, []);

  // Fetch farmers data
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

  // Fetch systems data
  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    const res = await fetch("/api/System");
    const data = await res.json();
    setTableData(data);
  };

  // Aggregate animal data by date
  const aggregateAnimalData = (data: any[]) => {
    const aggregatedData: { [key: string]: number } = {}; // Use string (date) as the key
    data.forEach((entry: { date: string; animalsDetected: number }) => {
      const { date, animalsDetected } = entry;
      if (aggregatedData[date]) {
        aggregatedData[date] += animalsDetected;
      } else {
        aggregatedData[date] = animalsDetected;
      }
    });

    // Convert the aggregated data into an array of objects
    return Object.keys(aggregatedData).map((date) => ({
      date,
      animalsDetected: aggregatedData[date],
    }));
  };

  // Navigate to the number of farmers page
  const handleFarmersCardClick = () => {
    router.push("/DashboardLayout/components/farmers");
  };

  const handleSystemsCardClick = () => {
    router.push("/DashboardLayout/components/System");
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Cards at the top */}
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={3}
            sx={{
              padding: 2,
              textAlign: "center",
              borderRadius: "12px",
              backgroundColor: "#b0e892",
              minHeight: "150px", // Ensure the card has a minimum height
            }}
            onClick={handleFarmersCardClick} // Navigate to the farmers page
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
              minHeight: "150px", // Ensure the card has a minimum height
            }}
            onClick={handleSystemsCardClick} // Navigate to the systems page
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

      {/* Bar Chart for Animal Detection */}
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ padding: 3, borderRadius: "12px" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="forestgreen"
              sx={{ marginBottom: 2 }}
            >
              Animal Detection by Type
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={animalTypesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  label={{
                    value: "Animals",
                    position: "insideBottom",
                    offset: -5, // Moves the label 10 units down
                  }}
                />
                <YAxis
                  label={{
                    value: "Count",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                  }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#027c68" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Animal Detection List Section */}
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
              color="forestgreen"
              sx={{
                marginBottom: 2,
                color: isDarkMode ? "#90caf9" : "forestgreen",
              }}
            >
              Animal Detection Details
            </Typography>
            {aggregateAnimalData(animalData).map((data, index) => (
              <Box
                key={index}
                sx={{
                  padding: 1,
                  marginBottom: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    color: isDarkMode ? "#0009" : "#000",
                  }}
                >
                  Date {data.date}: {data.animalsDetected} animals detected
                </Typography>
                {/* You can add more details here */}
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnimalsPage;
