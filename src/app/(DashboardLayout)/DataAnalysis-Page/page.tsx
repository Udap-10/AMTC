'use client';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Typography } from '@mui/material';


const DataAnalysisPage = () => {
  return (
    <PageContainer title="Data Analysis Page" description="this is Data Analysis page">
      <DashboardCard title="Data Analysis Page">
        <Typography>This is Data Anlysis page</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default DataAnalysisPage;