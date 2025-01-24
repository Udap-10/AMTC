"use client";

import { CssBaseline } from "@mui/material";
import { ThemeContextProvider } from "./DashboardLayout/context/ThemeContextProvider/page"; // Adjust the path if necessary
import { AuthProvider } from "./DashboardLayout/context/ThemeContextProvider/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Ensure that only ThemeContextProvider is used without a static theme */}
        <AuthProvider>
        <ThemeContextProvider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
