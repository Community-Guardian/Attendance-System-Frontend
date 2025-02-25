import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import type React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/userContext";
import { ToastProvider } from "@/components/ui/toast"

export const metadata = {
  title: "Class Attendance System",
  description: "Login to the Class Attendance System.",
  generator: "v0.dev",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <UserProvider>
              <ToastProvider>
                {children}
                <Toaster />
              </ToastProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
