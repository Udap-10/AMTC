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
} from "@mui/material";
import { useSession } from "next-auth/react"; // Import session
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";

const AnnouncementPage: React.FC = () => {
  const { data: session, status } = useSession(); // Get session
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [farmersData, setFarmersData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonthData, setCurrentMonthData] = useState<any[]>([]); // State to hold the data for the current month
  const [tableData, setTableData] = useState<any[]>([]);
  const [animalData, setAnimalData] = useState<any[]>([]);

  interface Announcement {
    message: string;
    postedBy: string;
    date: string;
    time: string;
  }

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
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < 0) {
      // Adjust this logic if you have more than one announcement
      setCurrentIndex(currentIndex + 1);
    }
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
          variant="h6"
          fontWeight="bold"
          sx={{ color: "forestgreen" }}
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

        {/* Data Analysis Section with Scatter Plot */}
        <Grid item xs={6}>
          <Card
            elevation={3}
            sx={{ padding: 4, borderRadius: "18px", marginTop: 3 }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
              Data Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid />
                <XAxis type="number" dataKey="day" name="Day" />
                <YAxis
                  type="number"
                  dataKey="animalsDetected"
                  name="Animals Detected"
                />
                <RechartsTooltip cursor={{ strokeDasharray: "3 3" }} />
                <Legend />
                <Scatter
                  name="Animals Detected"
                  data={currentMonthData}
                  fill="#027c68"
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Calendar Section */}
        <Grid item xs={6}>
          <Card
            elevation={3}
            sx={{
              padding: 2,
              borderRadius: "12px",
              marginTop: 3,
              height: "400px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <IconButton
                onClick={handlePreviousMonth}
                sx={{ color: "#027c68" }}
              >
                &lt;
              </IconButton>
              <Typography variant="h6" fontWeight="bold">
                {monthsArray[currentDate.getMonth()]}{" "}
                {currentDate.getFullYear()}
              </Typography>
              <IconButton onClick={handleNextMonth} sx={{ color: "#027c68" }}>
                &gt;
              </IconButton>
            </Box>

            {/* Calendar Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "4px",
              }}
            >
              {/* Weekdays Header */}
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                <Typography
                  key={day}
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#027c68",
                    padding: "8px 0",
                  }}
                >
                  {day}
                </Typography>
              ))}

              {/* Padding for Days Before First Day */}
              {Array.from({
                length:
                  (new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    1
                  ).getDay() +
                    6) %
                  7,
              }).map((_, index) => (
                <Box key={`empty-${index}`} sx={{ height: "40px" }} />
              ))}

              {/* Days of the Month */}
              {Array.from(
                {
                  length: new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    0
                  ).getDate(),
                },
                (_, i) => i + 1
              ).map((day) => (
                <Box
                  key={day}
                  sx={{
                    padding: "8px",
                    textAlign: "center",
                    backgroundColor: isToday(day, currentDate)
                      ? "#28a745"
                      : day === selectedDate?.getDate()
                      ? "#027c68" // Selected date background
                      : "#f8f9fa", // Default background
                    color:
                      isToday(day, currentDate) ||
                      day === selectedDate?.getDate()
                        ? "white"
                        : "#495057",
                    borderRadius: "4px",
                    cursor: "pointer",
                    boxShadow:
                      isToday(day, currentDate) ||
                      day === selectedDate?.getDate()
                        ? "0 2px 4px rgba(0, 0, 0, 0.2)"
                        : "",
                    fontWeight: isToday(day, currentDate) ? "bold" : "normal",
                  }}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnnouncementPage;
