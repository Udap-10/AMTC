"use client";

import { CssBaseline } from "@mui/material";
import { ThemeContextProvider } from "./(DashboardLayout)/context/ThemeContextProvider/page"; // Adjust the path if necessary

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Ensure that only ThemeContextProvider is used without a static theme */}
        <ThemeContextProvider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeContextProvider>
      </body>
    </html>
  );
}
