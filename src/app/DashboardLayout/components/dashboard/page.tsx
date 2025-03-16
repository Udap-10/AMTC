"use client";
import DevicesIcon from "@mui/icons-material/Devices";
import PeopleIcon from "@mui/icons-material/People";
import PetsIcon from "@mui/icons-material/Pets";
import {
  Avatar,
  Box,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react"; // Import session
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MONTH_COLORS = [
  "#8884d8",
  "#8dd1e1",
  "#82ca9d",
  "#a4de6c",
  "#d0ed57",
  "#ffc658",
  "#ff8042",
  "#ffbb28",
  "#ff7300",
  "#d0ed57",
  "#a4de6c",
  "#82ca9d",
];

const AnnouncementPage: React.FC = () => {
  const { data: session, status } = useSession(); // Get session
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [farmersData, setFarmersData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonthData, setCurrentMonthData] = useState<any[]>([]); // State to hold the data for the current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // State to hold the selected year
  const [tableData, setTableData] = useState<any[]>([]);
  const [animalData, setAnimalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // State to track loading
  const [monthlyAnimalData, setMonthlyAnimalData] = useState<any[]>([]);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  interface Announcement {
    message: string;
    postedBy: string;
    date: string;
    time: string;
  }
  const ALL_MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [announcement, setAnnouncement] = useState<any>(null);

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    if (!session) {
      router.push("/login"); // Redirect to login if no session
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchAnnouncementData = async () => {
      try {
        const response = await fetch("/api/Announcement");
        const data = await response.json();

        if (data.success) {
          setAnnouncement(data.announcement);
        } else {
          console.error("Failed to fetch announcement:", data.message);
        }
      } catch (error) {
        console.error("Error fetching announcement data:", error);
      }
    };

    fetchAnnouncementData(); // Always call this inside the useEffect
  }, []); // Empty dependency array to run this once on mount

  const handlePrevious = () => {
    setSelectedYear((prevYear) => prevYear - 1);
  };

  const handleNext = () => {
    setSelectedYear((prevYear) => prevYear + 1);
  };

  const monthsArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/AnimalMonthWise?year=${selectedYear}`);
        const json = await res.json();
        if (json.success) {
          // Ensure all 12 months are included
          const mapped = ALL_MONTHS.map((month) => {
            const found = json.data.find(
              (item: { month: string }) => item.month === month
            );
            return { month, count: found ? found.count : 0 };
          });
          setMonthlyAnimalData(mapped);
        } else {
          console.error("API returned success: false");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Simulate data for each day of the month
  const generateMonthData = (month: number) => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      month + 1,
      0
    ).getDate();
    const data = [];
    for (let day = 1; day <= daysInMonth; day++) {
      data.push({
        day: day,
        animalsDetected: Math.floor(Math.random() * 10) + 1, // Random number of animals detected
      });
    }
    return data;
  };

  // Update the scatter plot data when the month changes
  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await fetch("/api/Animals");
        const data = await response.json();

        if (data.success) {
          // Extracting day and counting animals per day
          const aggregatedData = data.animals.reduce(
            (acc: any[], animal: { Date: string | number | Date }) => {
              const date = new Date(animal.Date);

              // Check if the data belongs to the selected month
              if (
                date.getMonth() === currentDate.getMonth() &&
                date.getFullYear() === currentDate.getFullYear()
              ) {
                const day = date.getDate();
                acc[day] = (acc[day] || 0) + 1; // Count occurrences per day
              }
              return acc;
            },
            {}
          );

          // Convert to array format for ScatterChart
          const finalData = Object.entries(aggregatedData).map(
            ([day, count]) => ({
              day: Number(day),
              animalsDetected: count,
            })
          );

          setCurrentMonthData(finalData);
        }
      } catch (error) {
        console.error("Error fetching animal data:", error);
      }
    };

    fetchAnimalData();
  }, [currentDate]); // Runs whenever the month changes

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

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    const res = await fetch("/api/System");
    const data = await res.json();
    setTableData(data);
  };

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return null; // Prevent rendering if no session
  }

  const handleFarmersCardClick = () => {
    router.push("/DashboardLayout/components/farmers");
  };

  const handleSystemsCardClick = () => {
    router.push("/DashboardLayout/components/System");
  };

  const handleAnimalsCardClick = () => {
    router.push("/DashboardLayout/components/Animals");
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
  };

  const isToday = (day: number, currentDate: Date): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Box sx={{ padding: 1, position: "relative" }}>
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "forestgreen", mt: -4, mb: 3 }} // Move up slightly, keep space below
        >
          Announcements
        </Typography>

        <Card
          elevation={3}
          sx={{
            marginTop: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
            borderRadius: "12px",
            marginBottom: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                backgroundColor: "forestgreen",
                width: 30,
                height: 30,
              }}
            >
              <PetsIcon sx={{ fontSize: 20, color: "white" }} />
            </Avatar>
            <Stack spacing={0.75}>
              {/* Display the fetched announcement */}
              {announcement ? (
                <>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontSize: "1rem" }}
                  >
                    {announcement.message}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {announcement.postedBy} | Posted on {announcement.date} at{" "}
                    {announcement.time}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Loading announcement...
                </Typography>
              )}
            </Stack>
          </Stack>
          <Box sx={{ display: "flex", alignItems: "center" }}></Box>
        </Card>
      </Box>

      {/* Dashboard and Cards */}
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
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
            <Divider sx={{ position: "relative", marginY: 1, height: "0px" }} />
            <Typography variant="h5" fontWeight="bold" sx={{ marginLeft: 20 }}>
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
            onClick={handleSystemsCardClick} // Handle click to navigate
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
            <Divider sx={{ position: "relative", marginY: 1, height: "0px" }} />
            <Typography variant="h5" fontWeight="bold" sx={{ marginLeft: 20 }}>
              {animalData.length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card
            elevation={3}
            sx={{
              padding: 4,
              borderRadius: "18px",
              marginTop: 1,
            }}
          >
            {/* Header Row: Title (Left) and Month Navigation (Right) */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color: isDarkMode ? "#90caf9" : "#027c68",
                  fontSize: "20px",
                  marginUp: 1,
                }}
              >
                Date-Wise Animal Detection Analysis
              </Typography>

              {/* Month Navigation */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={handlePreviousMonth}
                  sx={{
                    color: isDarkMode ? "#90caf9" : "#027c68",
                    fontSize: "32px",
                  }}
                >
                  <Typography sx={{ fontSize: 32, fontWeight: "bold" }}>
                    &lt;
                  </Typography>
                </IconButton>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    color: isDarkMode ? "#fff" : "#333",
                    fontSize: "20px",
                  }}
                >
                  {monthsArray[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </Typography>

                <IconButton
                  onClick={handleNextMonth}
                  sx={{
                    color: isDarkMode ? "#90caf9" : "#027c68",
                    fontSize: "32px",
                  }}
                >
                  <Typography sx={{ fontSize: 32, fontWeight: "bold" }}>
                    &gt;
                  </Typography>
                </IconButton>
              </Box>
            </Box>

            {/* Scatter Plot Chart */}
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart
                margin={{ top: 20, right: 30, left: 30, bottom: 50 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "#444" : "#ccc"}
                />

                <XAxis
                  type="number"
                  dataKey="day"
                  name="Date"
                  domain={[
                    1,
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      0
                    ).getDate(),
                  ]}
                  label={{
                    value: "Date",
                    position: "insideBottom",
                    dy: 30,
                    style: {
                      textAnchor: "middle",
                      fontWeight: "bold",
                      fill: isDarkMode ? "#fff" : "#333",
                      fontSize: 18,
                    },
                  }}
                  tick={{
                    fontWeight: "bold",
                    fill: isDarkMode ? "#fff" : "#333",
                    fontSize: 16,
                  }}
                />

                <YAxis
                  type="number"
                  dataKey="animalsDetected"
                  name="Count"
                  label={{
                    value: "Animals Count",
                    angle: -90,
                    position: "insideLeft",
                    dx: -20,
                    style: {
                      textAnchor: "middle",
                      fontWeight: "bold",
                      fill: isDarkMode ? "#fff" : "#333",
                      fontSize: 18,
                    },
                  }}
                  tick={{
                    fontWeight: "bold",
                    fill: isDarkMode ? "#fff" : "#333",
                    fontSize: 16,
                  }}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0) {
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: isDarkMode ? "#1e1e1e" : "white",
                            border: `1px solid ${isDarkMode ? "#666" : "#ccc"}`,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            fontSize: "14px",
                            color: isDarkMode ? "#fff" : "#000",
                          }}
                        >
                          <div>Date: {data.day}</div>
                          <div>Count: {data.animalsDetected}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Scatter
                  name="Animals Detected"
                  data={currentMonthData}
                  fill={isDarkMode ? "#90caf9" : "#027c68"}
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>

            {/* Legend below chart */}
            <Box sx={{ textAlign: "center", marginTop: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "#027c68", fontSize: "18px" }}
              >
                ● Animals Detected
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Pie Chart Card - Monthly Analysis */}
        <Grid item xs={12}>
          <Card
            elevation={3}
            sx={{ padding: 4, borderRadius: "18px", marginTop: 4 }}
          >
            {/* Header with Title and Year Navigation */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 3,
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#027c68", fontSize: "20px" }}
              >
                Monthly Animal Detection Overview
              </Typography>

              {/* Year Navigation */}
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
            </Box>

            {/* Pie Chart and Legend Side by Side */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 4,
              }}
            >
              {/* Pie Chart (Left Side) */}
              <ResponsiveContainer width="70%" height={420}>
                <PieChart>
                  <Pie
                    data={monthlyAnimalData}
                    dataKey="count"
                    nameKey="month"
                    isAnimationActive={true}
                    cx="50%"
                    cy="50%"
                    outerRadius={170}
                    innerRadius={60} // donut-style
                    label={false} // <<< Hide labels completely
                    labelLine={false}
                    fill="#8884d8"
                  >
                    {monthlyAnimalData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={MONTH_COLORS[index % MONTH_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}`, name]} />
                </PieChart>
              </ResponsiveContainer>

              {/* Vertical Legend (Right Side) */}
              <Box
                sx={{
                  width: { xs: "100%", md: "35%" },
                  maxHeight: 420,
                  overflowY: "auto",
                  pr: 2,
                  mt: { xs: 3, md: 0 },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 2, color: "#027c68" }}
                >
                  Month-Wise Legend
                </Typography>
                {monthlyAnimalData.map((entry, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1.5,
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor:
                          MONTH_COLORS[index % MONTH_COLORS.length],
                      }}
                    />
                    <Typography variant="body2" fontWeight="medium">
                      {entry.month}: {entry.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnnouncementPage;
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
