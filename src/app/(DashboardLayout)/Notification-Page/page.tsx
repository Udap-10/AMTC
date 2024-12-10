'use client';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Typography } from '@mui/material';


const NotificationPage = () => {
  return (
    <PageContainer title="Notification Page" description="this is Notification page">
      <DashboardCard title="Notification Page">
        <Typography>This is my Notification page</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default NotificationPage;