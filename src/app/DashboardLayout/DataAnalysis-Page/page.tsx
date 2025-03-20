"use client";

import PageContainer from "@/app/DashboardLayout/components/container/PageContainer";
import { useThemeContext } from "@/app/DashboardLayout/context/ThemeContextProvider/page";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const allDzongkhags = [
  "Bumthang",
  "Chukha",
  "Dagana",
  "Gasa",
  "Haa",
  "Lhuentse",
  "Mongar",
  "Paro",
  "Pema Gatshel",
  "Punakha",
  "Samdrup Jongkhar",
  "Samtse",
  "Sarpang",
  "Thimphu",
  "Trashigang",
  "Trashiyangtse",
  "Trongsa",
  "Tsirang",
  "WangduePhodrang",
  "Zhemgang",
];

const dzongkhagAbbr = [
  "BT",
  "CK",
  "DG",
  "GS",
  "HA",
  "LT",
  "MG",
  "PR",
  "PG",
  "PK",
  "SJ",
  "SM",
  "SP",
  "TP",
  "TG",
  "TY",
  "TR",
  "TS",
  "WP",
  "ZG",
];

const barColors = [
  "#4e79a7",
  "#f28e2c",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

const DataAnalysisPage = () => {
  const [animalCounts, setAnimalCounts] = useState<number[]>(Array(20).fill(0));
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [animalTypesByDzongkhag, setAnimalTypesByDzongkhag] = useState<
    Record<string, string[]>
  >({});
  const [totalAnimalsDetected, setTotalAnimalsDetected] = useState(0);
  const [averageAnimalsPerDzongkhag, setAverageAnimalsPerDzongkhag] =
    useState("0");
  const [maxAnimalsDetected, setMaxAnimalsDetected] = useState(0);
  const [maxAnimalsDzongkhag, setMaxAnimalsDzongkhag] = useState("N/A");

  const theme = useTheme();
  const { darkMode } = useThemeContext();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handlePrevious = () => {
    setSelectedYear((prevYear) => prevYear - 1);
  };

  const handleNext = () => {
    setSelectedYear((prevYear) => prevYear + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/AnimalTypesPerDzongkhag?year=${selectedYear}`
        );
        const data = await response.json();

        if (data.success) {
          // ✅ Ensure all 20 dzongkhags (from allDzongkhags) are accounted for in the counts
          const updatedCounts = allDzongkhags.map((dzongkhag) => {
            const index = data.dzongkhags.indexOf(dzongkhag);
            return index !== -1 ? data.animalCounts[index] : 0;
          });
          setAnimalCounts(updatedCounts);

          // ✅ Convert animal types per dzongkhag (with fallback for missing dzongkhags)
          const convertedAnimalTypes: Record<string, string[]> = {};
          allDzongkhags.forEach((dzongkhag) => {
            const types = data.animalTypesPerDzongkhag[dzongkhag] || {};
            convertedAnimalTypes[dzongkhag] = Object.entries(types).map(
              ([animalName, count]) => `${animalName} (${count})`
            );
          });
          setAnimalTypesByDzongkhag(convertedAnimalTypes);

          // ✅ Update summary metrics
          const total = updatedCounts.reduce((sum, count) => sum + count, 0);
          const average =
            updatedCounts.length > 0
              ? (total / updatedCounts.length).toFixed(2)
              : "0";
          const max = Math.max(...updatedCounts);
          const maxDzongkhags = allDzongkhags.filter(
            (_, idx) => updatedCounts[idx] === max
          );

          setTotalAnimalsDetected(total);
          setAverageAnimalsPerDzongkhag(average);
          setMaxAnimalsDetected(max);
          setMaxAnimalsDzongkhag(maxDzongkhags.join(", "));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedYear]);

  const chartData = {
    labels: dzongkhagAbbr,
    datasets: [
      {
        label: "Number of Animals Detected",
        data: animalCounts,
        backgroundColor: barColors,
        borderColor: darkMode ? "#fff" : "#333",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Animal Intrusion Detection by Dzongkhag",
        font: { size: isMobile ? 16 : 20 },
        color: darkMode ? "#fff" : "#000",
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          afterLabel: (tooltipItem: any) => {
            const index = tooltipItem.dataIndex;
            const dzongkhag = allDzongkhags[index];
            const animals = animalTypesByDzongkhag[dzongkhag];
            return animals?.length
              ? animals.map((animal) => `• ${animal}`)
              : ["• No animals detected"];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dzongkhags (Abbreviated)",
          color: darkMode ? "#fff" : "#000",
          font: { size: 14, weight: 600 },
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Animals Detected",
          color: darkMode ? "#fff" : "#000",
          font: { size: 14, weight: 600 },
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
          stepSize: 1, // 👈 Force integer steps
          precision: 0, // 👈 Force integer display (no decimals)
        },
      },
    },
  };

  return (
    <PageContainer
      title="Data Analysis Page"
      description="Analyze data on animal intrusion detection events"
    >
      <Card
        sx={{
          p: isMobile ? 2 : 4,
          borderRadius: 3,
          bgcolor: darkMode ? "#1a1a1a" : "#fafafa",
        }}
      >
        <CardContent>
          {/* Title + Year Navigation in same row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap", // optional: handles small screens better
            }}
          >
            {/* Title on the left */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#2e7d32",
                fontSize: isMobile ? 18 : 22,
              }}
            >
              Intrusion Detection Analysis
            </Typography>

            {/* Year Navigation on the right */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            <Typography
              variant="body2"
              sx={{ mb: 2, fontSize: isMobile ? 13 : 16 }}
            >
              Visual representation of animal intrusion detection counts across
              20 Dzongkhags.
            </Typography>

            {/* Bar Chart Section */}
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Box
                sx={{
                  minWidth: 600,
                  height: isMobile ? 300 : 450,
                }}
              >
                <Bar data={chartData} options={chartOptions} />
              </Box>
            </Box>
          </Box>

          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#2e7d32", mb: 2 }}
          >
            Dzongkhag Abbreviations & Color Legend
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ width: "100%", overflowX: "auto", mb: 4 }}
          >
            <Table size="small">
              <TableHead
                sx={{ backgroundColor: darkMode ? "#333" : "#f5f5f5" }}
              >
                <TableRow>
                  <TableCell>
                    <strong>Color</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Abbreviation</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Dzongkhag Name</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allDzongkhags.map((dzongkhag, index) => (
                  <TableRow key={dzongkhag}>
                    <TableCell>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: barColors[index],
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>{dzongkhagAbbr[index]}</TableCell>
                    <TableCell>{dzongkhag}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#2e7d32", mb: 2 }}
          >
            Key Metrics Summary
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ width: "100%", overflowX: "auto" }}
          >
            <Table size={isMobile ? "small" : "medium"}>
              <TableBody>
                <TableRow
                  sx={{ backgroundColor: darkMode ? "#2a2d34" : "#e3f2fd" }}
                >
                  <TableCell>
                    <strong>Total Animals Detected</strong>
                  </TableCell>
                  <TableCell>{totalAnimalsDetected}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ backgroundColor: darkMode ? "#263238" : "#f1f8e9" }}
                >
                  <TableCell>
                    <strong>Average Animals per Dzongkhag</strong>
                  </TableCell>
                  <TableCell>{averageAnimalsPerDzongkhag}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ backgroundColor: darkMode ? "#3e2723" : "#fff3e0" }}
                >
                  <TableCell>
                    <strong>Max Animals Detected (Dzongkhag)</strong>
                  </TableCell>
                  <TableCell>
                    {maxAnimalsDetected} ({maxAnimalsDzongkhag})
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default DataAnalysisPage;
