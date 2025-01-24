'use client';
import PageContainer from '@/app/DashboardLayout/components/container/PageContainer';
import { Box, Typography } from '@mui/material';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2'; // Importing chart.js

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DataAnalysisPage = () => {
  // Sample data for the chart
  const data = {
    labels: ['Paro', 'Thimphu', 'Haa', 'Bumthang', 'Samtse', 'Tsirang', 'Punakha'],  // Dzongkhag names as x-axis labels
    datasets: [
      {
        label: 'Number of Animals Detected',  // Data set label
        data: [12, 19, 3, 5, 2, 3, 7],  // Y-axis values (number of animals detected)
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
        text: 'Monthly Intrusion Detection in Each Dzongkhag', // Chart title
        fontSize: 20,
        fontWeight: 'bold',
      },
      tooltip: {
        mode: 'index' as const,  // Explicitly defining the type here
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Dzongkhag',  // X-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Animals Detected',  // Y-axis title
        },
      },
    },
  };

  return (
    <PageContainer title="Data Analysis Page" description="Analyze data on animal intrusion detection events">
      <Box sx={{ backgroundColor: 'transparent', padding: 2, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h5" sx={{ color: 'forestgreen', fontWeight: 'bold', mb: 3 }}>
          Intrusion Detection Analysis
        </Typography>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontSize: '1.25rem', fontWeight:'bold' }}>
            Data Overview
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, fontSize: '1rem' }}>
            This graph shows the number of animals detected per Dzongkhag. Use the chart to observe trends and plan responses.
          </Typography>
          
          {/* Chart Section */}
          <Box sx={{ height: 400 }}>
            <Line data={data} options={options} />
          </Box>

          {/* Additional Data Section (e.g., summary statistics) */}
          <Typography variant="h6" sx={{ mt: 5, fontSize: '1.25rem', color:'forestgreen', fontWeight:'bold' }}>
            Key Metrics:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              Total Animals Detected: 44
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              Average Animals Per Dzongkhag: 6.28
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              Maximum Animals Detected in Dzongkhag: 19 (Thimphu)
            </Typography>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default DataAnalysisPage;
