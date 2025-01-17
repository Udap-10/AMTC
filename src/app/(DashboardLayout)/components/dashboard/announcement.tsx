"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Typography,
  Stack,
  Avatar,
  Box,
  IconButton,
  Grid,
  Divider,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PeopleIcon from '@mui/icons-material/People';
import DevicesIcon from '@mui/icons-material/Devices';
import PetsIcon from '@mui/icons-material/Pets';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const AnnouncementPage: React.FC = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonthData, setCurrentMonthData] = useState<any[]>([]);  // State to hold the data for the current month

  const announcements = [
    {
      message: 'A Bear has been detected at Paro',
      time: '8:00 PM',
      date: 'Jan 3, 2025',
      postedBy: 'Admin',
    },
    {
      message: 'An Elephant has been found in fields of Gelephu',
      time: '9:00 AM',
      date: 'Jan 4, 2025',
      postedBy: 'Admin',
    },
    {
      message: 'Monkey found damaging the fields in Samtse',
      time: '2:00 PM',
      date: 'Jan 5, 2025',
      postedBy: 'Admin',
    },
    {
      message:
        'A Porcupine has been found in fields of Tsirang damaging the crops.',
      time: '9:00 AM',
      date: 'Jan 4, 2025',
      postedBy: 'Admin',
    },
    {
      message: 'Cattle has been found intruding the fields',
      time: '2:00 PM',
      date: 'Jan 5, 2025',
      postedBy: 'Admin',
    },
  ];

  const monthsArray = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Simulate data for each day of the month
  const generateMonthData = (month: number) => {
    const daysInMonth = new Date(currentDate.getFullYear(), month + 1, 0).getDate();
    const data = [];
    for (let day = 1; day <= daysInMonth; day++) {
      data.push({
        day: day,
        animalsDetected: Math.floor(Math.random() * 10) + 1,  // Random number of animals detected
      });
    }
    return data;
  };

  // Update the scatter plot data when the month changes
  useEffect(() => {
    const currentMonth = currentDate.getMonth();
    setCurrentMonthData(generateMonthData(currentMonth));
  }, [currentDate]);

  const handleFarmersCardClick = () => {
    router.push('/components/farmers');
  };

  const handleSystemsCardClick = () => {
    router.push('/components/System'); // Navigate to the system page
  };

  const handleAnimalsCardClick = () => {
    router.push('/components/Animals'); // Navigate to the animals page
  };

  const handleNext = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
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
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  return (
    <Box sx={{ padding: 1, position: 'relative' }}>
      <Box>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'forestgreen' }}>
          Announcements
        </Typography>
        <Card
          elevation={3}
          sx={{
            marginTop: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 2,
            borderRadius: '12px',
            marginBottom: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                backgroundColor: 'forestgreen',
                width: 30,
                height: 30,
              }}
            >
              <PersonIcon sx={{ fontSize: 20, color: 'white' }} />
            </Avatar>
            <Stack spacing={0.75}>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                {announcements[currentIndex].message}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {announcements[currentIndex].postedBy} | Posted on{' '}
                {announcements[currentIndex].date} at{' '}
                {announcements[currentIndex].time}
              </Typography>
            </Stack>
          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handlePrevious} disabled={currentIndex === 0}>
              <Typography variant="h6">&lt;</Typography>
            </IconButton>
            <IconButton
              onClick={handleNext}
              disabled={currentIndex === announcements.length - 1}
            >
              <Typography variant="h6">&gt;</Typography>
            </IconButton>
          </Box>
        </Card>
      </Box>

      {/* Dashboard and Cards */}
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        <Grid item xs={4}>
          <Card
            elevation={3}
            sx={{
              padding: 2,
              textAlign: 'center',
              borderRadius: '12px',
              backgroundColor: '#b0e892',
              cursor: 'pointer',
            }}
            onClick={handleFarmersCardClick}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
              <PeopleIcon sx={{ fontSize: 35, color: '#027c68', marginBottom: 1 }} />
              <Typography variant="body1" fontWeight="bold" sx={{ marginLeft: 2 }}>
                Number of Farmers
              </Typography>
            </Box>
            <Divider sx={{ position: 'relative', marginY: 1, height: '0px' }} />
            <Typography variant="h5" fontWeight="bold" sx={{ marginLeft: 30 }}>
              2000
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card
            elevation={3}
            sx={{
              padding: 2,
              textAlign: 'center',
              borderRadius: '12px',
              backgroundColor: '#b0e892',
            }}

            onClick={handleSystemsCardClick} // Handle click to navigate
          >
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
              <DevicesIcon sx={{ fontSize: 35, color: '#027c68', marginBottom: 1 }} />
              <Typography variant="body1" fontWeight="bold" sx={{ marginLeft: 2 }}>
                Number of Systems
              </Typography>
            </Box>
            <Divider sx={{ position: 'relative', marginY: 1, height: '0px' }} />
            <Typography variant="h5" fontWeight="bold" sx={{ marginLeft: 30 }}>
              2000
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card
            elevation={3}
            sx={{
              padding: 2,
              textAlign: 'center',
              borderRadius: '12px',
              backgroundColor: '#b0e892',
            }}

            onClick={handleAnimalsCardClick}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
              <PetsIcon sx={{ fontSize: 35, color: '#027c68', marginBottom: 1 }} />
              <Typography variant="body1" fontWeight="bold" sx={{ marginLeft: 2 }}>
                Total number of Animals Detected
              </Typography>
            </Box>
            <Divider sx={{ position: 'relative', marginY: 1, height: '0px' }} />
            <Typography variant="h5" fontWeight="bold" sx={{ marginLeft: 30 }}>
              2500
            </Typography>
          </Card>
        </Grid>

        {/* Data Analysis Section with Scatter Plot */}
        <Grid item xs={6}>
          <Card elevation={3} sx={{ padding: 4, borderRadius: '18px', marginTop: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
              Data Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="day" name="Day" />
                <YAxis type="number" dataKey="animalsDetected" name="Animals Detected" />
                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
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
          <Card elevation={3} sx={{ padding: 2, borderRadius: '12px', marginTop: 3, height: '400px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <IconButton onClick={handlePreviousMonth} sx={{ color: '#027c68' }}>
                &lt;
              </IconButton>
              <Typography variant="h6" fontWeight="bold">
                {monthsArray[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Typography>
              <IconButton onClick={handleNextMonth} sx={{ color: '#027c68' }}>
                &gt;
              </IconButton>
            </Box>

            {/* Calendar Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {/* Weekdays Header */}
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <Typography
                  key={day}
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#027c68',
                    padding: '8px 0',
                  }}
                >
                  {day}
                </Typography>
              ))}

              {/* Padding for Days Before First Day */}
              {Array.from({ length: (new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() + 6) % 7 }).map((_, index) => (
                <Box key={`empty-${index}`} sx={{ height: '40px' }} />
              ))}

              {/* Days of the Month */}
              {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => (
                <Box
                  key={day}
                  sx={{
                    padding: '8px',
                    textAlign: 'center',
                    backgroundColor:
                      day === selectedDate?.getDate()
                        ? '#027c68'
                        : '#f8f9fa',
                    color: day === selectedDate?.getDate() ? 'white' : '#495057',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow:
                      day === selectedDate?.getDate()
                        ? '0 2px 4px rgba(0, 0, 0, 0.2)'
                        : '',
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
