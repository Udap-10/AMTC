"use client";

import PageContainer from "@/app/DashboardLayout/components/container/PageContainer";
import { useThemeContext } from "@/app/DashboardLayout/context/ThemeContextProvider/page"; // Import Dark Mode Context
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Import useTheme from MUI
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DataAnalysisPage = () => {
  const [dzongkhags, setDzongkhags] = useState<string[]>([]);
  const [animalCounts, setAnimalCounts] = useState<number[]>([]);
  const theme = useTheme(); // Access MUI theme
  const { darkMode } = useThemeContext(); // Access dark mode state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/DataAnalysis");
        const data = await response.json();
        if (data.success) {
          setDzongkhags(data.dzongkhags);
          setAnimalCounts(data.animalCounts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Compute key metrics dynamically
  const totalAnimalsDetected = animalCounts.reduce(
    (sum, count) => sum + count,
    0
  );
  const averageAnimalsPerDzongkhag =
    animalCounts.length > 0
      ? (totalAnimalsDetected / animalCounts.length).toFixed(2)
      : "0";
  const maxAnimalsIndex = animalCounts.indexOf(Math.max(...animalCounts));
  const maxAnimalsDetected = animalCounts[maxAnimalsIndex] || 0;
  const maxAnimalsDzongkhag = dzongkhags[maxAnimalsIndex] || "N/A";

  const data = {
    labels: dzongkhags,
    datasets: [
      {
        label: "Number of Animals Detected",
        data: animalCounts,
        borderColor: darkMode
          ? "rgba(255, 255, 255, 1)"
          : "rgba(75, 192, 192, 1)", // Light or dark mode color
        backgroundColor: darkMode
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Monthly Intrusion Detection in Each Dzongkhag",
        font: {
          size: 16,
          weight: "bold" as const,
        },
        color: darkMode ? "#ffffff" : "#333", // Adjust color for dark mode
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dzongkhag",
          font: {
            size: 15,
            weight: "bold" as const,
          },
          color: darkMode ? "#ffffff" : "black",
        },
        ticks: {
          font: {
            size: 13,
            weight: "normal" as const,
          },
          color: darkMode ? "#ffffff" : "black",
        },
      },

      y: {
        title: {
          display: true,
          text: "Number of Animals Detected",
          font: {
            size: 15,
            weight: "bold" as const,
          },
          color: darkMode ? "#ffffff" : "black",
        },
        ticks: {
          font: {
            size: 13,
            weight: "normal" as const,
          },
          color: darkMode ? "#ffffff" : "black",
        },
      },
    },
  };

  return (
    <PageContainer
      title="Data Analysis Page"
      description="Analyze data on animal intrusion detection events"
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.default, // ✅ Dynamic Background Color
          color: theme.palette.text.primary, // ✅ Dynamic Text Color
          padding: 2,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          Intrusion Detection Analysis
        </Typography>

        <Box>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontSize: "1.25rem", fontWeight: "bold" }}
          >
            Data Overview
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, fontSize: "1.1rem" }}>
            This graph shows the number of animals detected per Dzongkhag.
          </Typography>

          {/* Chart Section */}
          <Box sx={{ height: 400 }}>
            <Line data={data} options={options} />
          </Box>

          {/* Additional Data Section */}
          <Typography
            variant="h6"
            sx={{ mt: 5, fontSize: "1.25rem", fontWeight: "bold" }}
          >
            Key Metrics:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontSize: "1rem" }} mb={1}>
              Total Animals Detected: {totalAnimalsDetected}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "1rem" }} mb={1}>
              Average Animals Per Dzongkhag: {averageAnimalsPerDzongkhag}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "1rem" }}>
              Maximum Animals Detected in Dzongkhag: {maxAnimalsDetected} (
              {maxAnimalsDzongkhag})
            </Typography>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default DataAnalysisPage;
