"use client"
import type React from "react"
import { Sidebar } from "@/components/ui/sidebar"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Call all providers
import { AttendanceProvider } from "@/context/AttendanceContext"
import { BorrowAccountsProvider } from "@/context/BorrowAccountsContext"
import { ConfigProvider } from "@/context/ConfigContext"
import { CoursesProvider } from "@/context/CoursesContext"
import { GeolocationProvider } from "@/context/GeoLocationContext"
import { ReportsProvider } from "@/context/ReportContext"
import { TimetableProvider } from "@/context/TimetableContext"
import { useAuth } from "@/context/AuthContext"
import FullPageLoader from "@/components/custom/FullPageLoader"

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { role: "student" | "lecturer" | "hod" | "dp_academics" | "config" }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const { loading } = useAuth()

  useEffect(() => {
    // Show toast only if no token and not loading
    if (!loading && !Cookies.get("accessToken")) {
      toast({
        title: "Unauthorized",
        description: "You need to login to access this page",
        variant: "default",
      })

      // Redirect after showing the toast
      setTimeout(() => {
        router.replace("/login")
      }, 3000)
    }
  }, [loading, router, toast]) // Ensures it only runs once after loading and token check

  // If still loading or no access token, show the full-page loader
  if (loading || !Cookies.get("accessToken")) {
    return <FullPageLoader message="Please wait...." />
  }

  return (
    <div className="flex flex-col h-screen lg:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <AttendanceProvider>
          <BorrowAccountsProvider>
            <ConfigProvider>
              <CoursesProvider>
                <GeolocationProvider>
                  <ReportsProvider>
                    <TimetableProvider>
                      {children}
                    </TimetableProvider>
                  </ReportsProvider>
                </GeolocationProvider>
              </CoursesProvider>
            </ConfigProvider>
          </BorrowAccountsProvider>
        </AttendanceProvider>
      </main>
    </div>
  )
}
