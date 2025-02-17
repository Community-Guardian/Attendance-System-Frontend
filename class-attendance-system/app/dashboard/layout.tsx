"use client"
import type React from "react"
import { Sidebar } from "@/components/ui/sidebar"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
// call all providers
import { AttendanceProvider } from "@/context/AttendanceContext"
import { BorrowAccountsProvider } from "@/context/BorrowAccountsContext"
import { ConfigProvider } from "@/context/ConfigContext"
import { CoursesProvider } from "@/context/CoursesContext"
import { GeolocationProvider } from "@/context/GeoLocationContext"
import { ReportsProvider } from "@/context/ReportContext"
import { TimetableProvider } from "@/context/TimetableContext"
import {  useUser } from "@/context/userContext"
import FullPageLoader from "@/components/custom/FullPageLoader"
export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { role: "student" | "lecturer" | "hod" | "dp_academics" | "config" }
}) {
  const router = useRouter()
  const {toast} = useToast()
  useEffect(() => {
    try {
      if (!Cookies.get("accessToken")) {
        toast({
          title: "Unauthorized",
          description: "You need to login to access this page",
          variant: "destructive",
        })
        setTimeout(() => router.push("/login"), 3000)
      }
    } catch (error) {
      console.error("Toast error:", error)
    }
  }, [])
  const {loading} = useUser()


  if (loading) {
    return <FullPageLoader message="Syncing Your details...." />;
  }
  return (
  <div className="flex flex-col h-screen lg:flex-row">
    <Sidebar/>
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

