'use client';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer'; // Ensure this path is correct
import AnnouncementPage from '@/app/(DashboardLayout)/components/dashboard/announcement'; // Ensure this path is correct
import { Box, Grid } from '@mui/material';
import Farmers from '@/app/(DashboardLayout)/components/farmers/page';

const Dashboard = () => {
  return (
    <PageContainer>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Render the Announcement component with required props */}
            <AnnouncementPage
              message="An animal has been detected at Paro"
              time="8:00 PM"
              date="Jan 3, 2025"
              postedBy="Admin"
            />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnnouncementPage />} />
        <Route path="/farmers" element={<Farmers />} />
      </Routes>
    </Router>
  );
}
export default Dashboard;
