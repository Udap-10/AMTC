'use client';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Box, Typography } from '@mui/material';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2'; // Importing chart.js

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DataAnalysisPage = () => {
  // Sample data for the chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],  // X-axis labels (months)
    datasets: [
      {
        label: 'Intrusion Detection Events',  // Data set label
        data: [12, 19, 3, 5, 2, 3],  // Y-axis values (number of events detected)
        borderColor: 'rgba(75, 192, 192, 1)',  // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Fill color
        tension: 0.4,  // Smoothness of the line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Intrusion Detection Events',
        fontSize: 100,
        fontWeight: 'bold',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Events',
        },
      },
    },
  };

  return (
    <PageContainer title="Data Analysis Page" description="Analyze data on animal intrusion detection events">
      <DashboardCard title="Intrusion Detection Analysis">
        <Typography variant="h6" sx={{ mb: 2, fontSize: '1.25rem' }}> {/* Increased font size for "Data Overview" */}
          Data Overview
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, fontSize: '1rem' }}> {/* Increased font size for body text */}
          This graph shows the number of intrusion detection events per month. Use the chart to observe trends and plan responses.
        </Typography>
        
        {/* Chart Section */}
        <Box sx={{ height: 400 }}>
          <Line data={data} options={options} />
        </Box>

        {/* Additional Data Section (e.g., summary statistics) */}
        <Typography variant="h6" sx={{ mt: 5, fontSize: '1.25rem' }}> {/* Increased font size for "Key Metrics" */}
          Key Metrics:
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}> {/* Increased font size for summary text */}
            Total Events Detected: 44
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
            Average Events Per Month: 7.33
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
            Maximum Events in a Month: 19 (February)
          </Typography>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default DataAnalysisPage;
