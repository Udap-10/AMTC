"use client";

import PageContainer from "@/app/DashboardLayout/components/container/PageContainer";
import DashboardCard from "@/app/DashboardLayout/components/shared/DashboardCard";
import { useThemeContext } from "@/app/DashboardLayout/context/ThemeContextProvider/page";
import { keyframes } from "@emotion/react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Animation for the fade-in effect
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const AboutUsPage = () => {
  const theme = useTheme();
  const { darkMode } = useThemeContext();
  return (
    <PageContainer
      title="About Us"
      description="Learn more about Smart Farm Security and our mission."
    >
      <DashboardCard title="About Us">
        <Box sx={{ animation: `${fadeIn} 1.5s ease-in` }}>
          {/* Image Section */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={4}
            sx={{
              animation: `${fadeIn} 1.5s ease-in-out`,
            }}
          >
            <img
              src="/images/logos/Animal Data.png"
              alt="Animal Data"
              style={{
                width: "80%",
                maxWidth: "500px",
                borderRadius: "8px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
              }}
              className="imageHover"
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
                    backgroundColor: darkMode ? "#1e1e1e" : "#f0f9ff", // Dark/Light mode support
                    color: darkMode ? "#fff" : "#000", // Adjust text color
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease-in-out",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ fontWeight: "bold" }}
                  >
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
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#2c2c2c" : "#fef6e4", // Dark gray for dark mode
                    color:
                      theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease-in-out",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ fontWeight: "bold" }}
                  >
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
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#2c2c2c" : "#f7f6f2", // Dark gray for dark mode
                    color:
                      theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease-in-out",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ fontWeight: "bold" }}
                  >
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
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1b3b1b" : "#e6ffe6", // Dark green for dark mode
                    color:
                      theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease-in-out",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ fontWeight: "bold" }}
                  >
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
