'use client'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Box, Grid } from '@mui/material';
// components
import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';

const Dashboard = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   const token = localStorage.getItem('token'); // Replace with your actual auth check
  //   if (!token) {
  //     router.push('/'); // Redirect to login page if not authenticated
  //   }
  // }, [router]);
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <Blog />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;
