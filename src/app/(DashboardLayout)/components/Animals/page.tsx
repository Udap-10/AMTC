"use client";
import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Grid, Divider, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import PeopleIcon from '@mui/icons-material/People';
import DevicesIcon from '@mui/icons-material/Devices';
import PetsIcon from '@mui/icons-material/Pets';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnimalsPage: React.FC = () => {
  const router = useRouter();
  const [animalData, setAnimalData] = useState<any[]>([]);
  const [currentMonthData, setCurrentMonthData] = useState<any[]>([]);

  // Simulate data for animal detections
  useEffect(() => {
    const generateAnimalData = () => {
      const data = [
        { day: 1, animalsDetected: 5 },
        { day: 2, animalsDetected: 3 },
        { day: 3, animalsDetected: 7 },
        { day: 4, animalsDetected: 2 },
        { day: 5, animalsDetected: 8 },
        { day: 6, animalsDetected: 6 },
        { day: 7, animalsDetected: 4 },
        // Add more days here as needed
      ];
      setAnimalData(data);
      setCurrentMonthData(data);
    };

    generateAnimalData();
  }, []);

  // Data for the bar chart
  const animalTypesData = [
    { name: 'Bear', count: 15 },
    { name: 'Boar', count: 20 },
    { name: 'Cattle', count: 35 },
    { name: 'Deer', count: 10 },
    { name: 'Elephant', count: 5 },
    { name: 'Horse', count: 12 },
    { name: 'Monkey', count: 25 },
    { name: 'Porcupine', count: 8 },
    { name: 'Raccoon', count: 18 },
  ];

  // Navigate to the number of farmers page
  const handleFarmersClick = () => {
    router.push('/components/farmers'); // Redirect to the farmers page
  };

  // Navigate to the number of systems page
  const handleSystemClick = () => {
    router.push('components/System'); // Redirect to the systems page
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
              textAlign: 'center',
              borderRadius: '12px',
              backgroundColor: '#b0e892',
              minHeight: '150px', // Ensure the card has a minimum height
            }}
            onClick={handleFarmersClick} // Navigate to the farmers page
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

        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={3}
            sx={{
              padding: 2,
              textAlign: 'center',
              borderRadius: '12px',
              backgroundColor: '#b0e892',
              minHeight: '150px', // Ensure the card has a minimum height
            }}
            onClick={handleSystemClick} // Navigate to the systems page
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
      </Grid>

      {/* Bar Chart for Animal Detection */}
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ padding: 3, borderRadius: '12px' }}>
            <Typography variant="h6" fontWeight="bold" color="forestgreen" sx={{ marginBottom: 2 }}>
              Animal Detection by Type
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={animalTypesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Animals', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 0 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#027c68" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Animal Detection List Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ padding: 3, borderRadius: '12px' }}>
            <Typography variant="h6" fontWeight="bold" color="forestgreen" sx={{ marginBottom: 2 }}>
              Animal Detection Details
            </Typography>
            {animalData.map((data, index) => (
              <Box key={index} sx={{ padding: 1, marginBottom: 2, backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Day {data.day}: {data.animalsDetected} animals detected
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
