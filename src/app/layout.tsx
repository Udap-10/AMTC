"use client";

import { CssBaseline } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./DashboardLayout/context/ThemeContextProvider/AuthContext";
import { ThemeContextProvider } from "./DashboardLayout/context/ThemeContextProvider/page"; // Adjust the path if necessary

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthProvider>
            <ThemeContextProvider>
              <CssBaseline />
              <ThemeWrapper>{children}</ThemeWrapper>{" "}
              {/* Ensures hooks work correctly */}
            </ThemeContextProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

// ✅ Fix: Create a wrapper to properly apply themes
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};
