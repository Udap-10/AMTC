'use client';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Typography } from '@mui/material';


const SettingPage = () => {
  return (
    <PageContainer title="Setting Page" description="this is Setting page">
      <DashboardCard title="Setting Page">
        <Typography>This is a Setting page</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default SettingPage;


