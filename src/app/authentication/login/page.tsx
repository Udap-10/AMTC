"use client";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
// components
import PageContainer from "@/app/DashboardLayout/components/container/PageContainer";
import AuthLogin from "../auth/AuthLogin";

const Login2 = () => {
  return (
    <PageContainer title="Login" description="This is Login page">
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "100vh",
          }}
        >
          {/* Left Side - Image with curved corners */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: "none", md: "block" },
              backgroundImage: 'url("/images/backgrounds/animal.webp")',
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              minHeight: "100vh",
              borderTopRightRadius: "100px",
              borderBottomRightRadius: "100px",
            }}
          />

          {/* Right Side - Login Form */}
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              px: { xs: 3, sm: 5, md: 6 },
              py: { xs: 4, sm: 6, md: 8 },
              position: "relative",
            }}
          >
            {/* Directly embedding the Login Form */}
            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: "95%", sm: "400px" }, // Adjusted for small screens
                minHeight: { xs: "300px", sm: "350px" },
                height: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "left",
              }}
            >
              <AuthLogin
                subtext={
                  <Typography
                    variant="h4"
                    textAlign="center"
                    color="greenforest"
                    fontFamily={"Times New Roman"}
                    mb={1}
                  >
                    Sign In
                  </Typography>
                }
                subtitle={
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    mt={3}
                  ></Stack>
                }
              />

              {/* Create Account Link */}
              <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                <Typography color="textSecondary" variant="h6" fontWeight="500">
                  Don't have an account?
                </Typography>
                <Typography
                  component={Link}
                  href="/authentication/register"
                  fontWeight="500"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                    fontSize: "18px",
                  }}
                >
                  Create an account
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login2;
