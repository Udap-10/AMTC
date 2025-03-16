"use client";
import PageContainer from "@/app/DashboardLayout/components/container/PageContainer";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";

const Register2 = () => (
  <PageContainer title="Register" description="this is Register page">
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
        sx={{ width: "100%", height: "100%", minHeight: "100vh" }}
      >
        {/* Left Side - Image */}
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

        {/* Right Side - Register Form */}
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
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "95%", sm: "450px", md: "500px" },
              minHeight: { xs: "350px", sm: "400px" },
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "left",
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              color="greenforest"
              fontFamily={"Times New Roman"}
              mb={0}
            >
              Sign Up
            </Typography>

            {/* Registration Form */}
            <Box component="form" sx={{ width: "70%", mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Username
              </Typography>
              <TextField fullWidth variant="outlined" sx={{ mb: 2 }} />

              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Email
              </Typography>
              <TextField fullWidth variant="outlined" sx={{ mb: 2 }} />

              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1, marginTop: 2 }}
              >
                Register
              </Button>
            </Box>

            <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
              <Typography color="textSecondary" variant="h6" fontWeight="400">
                Already have an Account?
              </Typography>
              <Typography
                component={Link}
                href="/authentication/login"
                fontWeight="500"
                sx={{
                  textDecoration: "none",
                  color: "primary.main",
                  fontSize: "20px",
                }}
              >
                Sign In
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </PageContainer>
);

export default Register2;
