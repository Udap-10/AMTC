import CustomTextField from "@/app/DashboardLayout/components/forms/theme-elements/CustomTextField";
import { Box, Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const router = useRouter(); // For redirecting after signup
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
      localStorage.setItem("token", data.token); // If your API returns a token
      localStorage.setItem("username", data.username);
      localStorage.setItem("_id", data.userId); // ✅ Save _id for account deletion

      console.log("User ID stored:", localStorage.getItem("_id")); // Debugging

      alert("Signup successful! Redirecting to login...");
      router.push("/authentication/login"); // Redirect on success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack mb={3}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="username"
            mb="5px"
          >
            Username
          </Typography>
          <CustomTextField
            id="username"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={handleChange}
          />

          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
            mt="25px"
          >
            Email
          </Typography>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />

          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
            mt="25px"
          >
            Password
          </Typography>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />
        </Stack>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthRegister;
