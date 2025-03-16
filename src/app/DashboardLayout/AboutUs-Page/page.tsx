"use client";

import PageContainer from "@/app/DashboardLayout/components/container/PageContainer";
import DashboardCard from "@/app/DashboardLayout/components/shared/DashboardCard";
import { useThemeContext } from "@/app/DashboardLayout/context/ThemeContextProvider/page";
import { keyframes } from "@emotion/react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
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
      <DashboardCard>
        <Box>
          <Typography
            sx={{
              color: "forestgreen",
              fontWeight: "bold",
              fontSize: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            About Us
          </Typography>
          <Box sx={{ animation: `${fadeIn} 1.5s ease-in` }} />
          {/* Image Section with Equal Sized Cards */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={4}
            sx={{ animation: `${fadeIn} 1.5s ease-in-out` }}
          >
            <Grid container spacing={2} justifyContent="center">
              {[
                {
                  src: "/images/logos/udap.png",
                  name: "Udap Kharka",
                  role: "Team Leader and Developer",
                  description:
                    "Udap Kharka is a student at the College of Science and Technology, pursuing an undergraduate degree in Information Technology (2021-2025).",
                },
                {
                  src: "/images/logos/katu.png",
                  name: "Wangchuk",
                  role: "Developer",
                  description:
                    "Wangchuk is a student at the College of Science and Technology, pursuing an undergraduate degree in Information Technology (2021-2025).",
                },
                {
                  src: "/images/logos/deepu.png",
                  name: "Depashna Pradhan",
                  role: "Developer",
                  description:
                    "Depashna Pradhan is a student at the College of Science and Technology, pursuing an undergraduate degree in Information Technology (2021-2025).",
                },
                {
                  src: "/images/logos/pala1.png",
                  name: "Sangay Wangchuk",
                  role: "Developer",
                  description:
                    "Sangay Wangchuk is a student at the College of Science and Technology, pursuing an undergraduate degree in Information Technology (2021-2025).",
                },
              ].map((item, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Card
                    sx={{
                      textAlign: "center",
                      borderRadius: "8px",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                      height: "100%",
                    }}
                  >
                    <Tooltip title={item.description} arrow placement="top">
                      <CardMedia
                        component="img"
                        height="160"
                        image={item.src}
                        alt={`Image ${index + 1}`}
                        sx={{
                          objectFit: "contain",
                          width: "100%",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                    <CardContent sx={{ paddingBottom: "16px" }}>
                      <Typography variant="body1" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginTop: "4px" }}
                      >
                        {item.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </DashboardCard>

      <Box sx={{ mt: 4 }}>
        {" "}
        {/* Added margin-top for spacing */}
        <Grid container spacing={4}>
          {/* Mission */}
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: darkMode ? "#1e1e1e" : "#f0f9ff",
                color: darkMode ? "#fff" : "#000",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Our Mission
              </Typography>
              <Typography>
                Safeguard farms with innovative technologies, protecting crops
                and livestock while promoting sustainable agriculture worldwide.
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
                  theme.palette.mode === "dark" ? "#2c2c2c" : "#fef6e4",
                color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
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
                  theme.palette.mode === "dark" ? "#2c2c2c" : "#f7f6f2",
                color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
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
                  theme.palette.mode === "dark" ? "#1b3b1b" : "#e6ffe6",
                color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Our Vision
              </Typography>
              <Typography>
                A harmonious balance between agriculture and wildlife, fostering
                sustainable prosperity for both.
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
    </PageContainer>
  );
};

export default AboutUsPage;
