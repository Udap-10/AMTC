"use client";

import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { Box, Grid, Paper, Typography } from "@mui/material";

const AboutUsPage = () => {
  return (
    <PageContainer
      title="About Us"
      description="Learn more about Smart Farm Security and our mission."
    >
      <DashboardCard title="About Us">
        <Box>
          {/* Image Section */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={4}
          >
            <img
              src="/images/logos/Animal Data.png"
              alt="Animal Data"
              style={{
                width: "80%",
                maxWidth: "500px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
          </Box>

          {/* Content Section */}
          <Box>
            <Grid container spacing={4}>
              {/* Mission */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    backgroundColor: "#f0f9ff", // Light blue background
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Our Mission
                  </Typography>
                  <Typography>
                    Safeguard farms with innovative technologies, protecting
                    crops and livestock while promoting sustainable agriculture
                    worldwide.
                  </Typography>
                </Paper>
              </Grid>

              {/* What We Do */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    backgroundColor: "#fef6e4", // Light yellow background
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    What We Do
                  </Typography>
                  <Typography>
                    We use AI-driven solutions to detect and prevent animal
                    intrusions in real time, empowering farmers to act quickly.
                  </Typography>
                </Paper>
              </Grid>

              {/* Why Choose Us */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    backgroundColor: "#f7f6f2", // Light gray background
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Why Choose Us?
                  </Typography>
                  <Typography>
                    Reliable technology, real-time alerts, and a commitment to
                    reducing human-wildlife conflicts.
                  </Typography>
                </Paper>
              </Grid>

              {/* Vision */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 3,
                    borderRadius: 2,
                    textAlign: "center",
                    backgroundColor: "#e6ffe6", // Light green background
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Our Vision
                  </Typography>
                  <Typography>
                    A harmonious balance between agriculture and wildlife,
                    fostering sustainable prosperity for both.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Contact Section */}
            <Box mt={4} textAlign="center">
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography>
                Have questions? Email us at{" "}
                <a href="mailto:support@smartfarmsecurity.com">
                  support@smartfarmsecurity.com
                </a>
                .
              </Typography>
            </Box>
          </Box>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default AboutUsPage;
