'use client';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Typography } from '@mui/material';


const AboutUsPage = () => {
  return (
    <PageContainer title="AboutUS Page" description="this is AboutUs page">
      <DashboardCard title="AboutUs Page">
        <Typography>This is About Us page</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default AboutUsPage;