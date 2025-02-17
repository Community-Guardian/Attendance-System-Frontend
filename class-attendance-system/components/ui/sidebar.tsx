"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useUser } from "@/context/userContext"
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  Menu,
  BookOpen,
  UserCog,
  School,
  Map,
  Activity,
  User,
  BarChart,
  LogOut,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, loading } = useUser()
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login") // Redirect if no user
    }
  }, [user, loading, router])

  if (loading) {
    return null // Don't show the sidebar while loading
  }

  if (!user) {
    return null // Prevent rendering if no user
  }

  const role = user.role as keyof typeof routes

  const routes = {
    student: [
      { href: "/dashboard/student", icon: Home, title: "Dashboard" },
      { href: "/dashboard/student/attendance", icon: Users, title: "Attendance" },
      { href: "/dashboard/student/courses", icon: BookOpen, title: "Courses" },
      { href: "/dashboard/student/schedule", icon: Calendar, title: "Schedule" },
      { href: "/dashboard/student/reports", icon: FileText, title: "Reports" },
      { href: "/dashboard/student/settings", icon: Settings, title: "Settings" },
    ],
    lecturer: [
      { href: "/dashboard/lecturer", icon: Home, title: "Dashboard" },
      { href: "/dashboard/lecturer/attendance", icon: Users, title: "Attendance" },
      { href: "/dashboard/lecturer/courses", icon: BookOpen, title: "Courses" },
      { href: "/dashboard/lecturer/schedule", icon: Calendar, title: "Schedule" },
      { href: "/dashboard/lecturer/reports", icon: FileText, title: "Reports" },
      { href: "/dashboard/lecturer/settings", icon: Settings, title: "Settings" },
    ],
    hod: [
      { href: "/dashboard/hod", icon: Home, title: "Dashboard" },
      { href: "/dashboard/hod/courses", icon: BookOpen, title: "Courses" },
      { href: "/dashboard/hod/lecturers", icon: Users, title: "Lecturers" },
      { href: "/dashboard/hod/students", icon: User, title: "Students" },
      { href: "/dashboard/hod/attendance", icon: Activity, title: "Attendance" },
      { href: "/dashboard/hod/timetable", icon: Calendar, title: "Timetable" },
      { href: "/dashboard/hod/reports", icon: FileText, title: "Reports" },
      { href: "/dashboard/hod/settings", icon: Settings, title: "Settings" },
    ],
    dp_academics: [
      { href: "/dashboard/dp-academics", icon: Home, title: "Dashboard" },
      { href: "/dashboard/dp-academics/departments", icon: School, title: "Departments" },
      { href: "/dashboard/dp-academics/courses", icon: BookOpen, title: "Courses" },
      { href: "/dashboard/dp-academics/attendance", icon: Activity, title: "Attendance" },
      { href: "/dashboard/dp-academics/timetable", icon: Calendar, title: "Timetable" },
      { href: "/dashboard/dp-academics/reports", icon: FileText, title: "Reports" },
      { href: "/dashboard/dp-academics/settings", icon: Settings, title: "Settings" },
    ],
    config_user: [
      { href: "/dashboard/config", icon: Home, title: "Dashboard" },
      { href: "/dashboard/config/users", icon: UserCog, title: "User Management" },
      { href: "/dashboard/config/courses", icon: BookOpen, title: "Courses" },
      { href: "/dashboard/config/departments", icon: School, title: "Departments" },
      { href: "/dashboard/config/timetables", icon: Calendar, title: "Timetables" },
      { href: "/dashboard/config/geolocation", icon: Map, title: "Geolocation" },
      { href: "/dashboard/config/system", icon: Settings, title: "System Config" },
      { href: "/dashboard/config/logs", icon: BarChart, title: "System Logs" },
    ],
    admin: [
      { href: "/dashboard/admin", icon: Home, title: "Admin Dashboard" },
      { href: "/dashboard/admin/users", icon: Users, title: "Manage Users" },
      { href: "/dashboard/admin/settings", icon: Settings, title: "Settings" },
    ],
  }

  const currentRoutes = routes[role] || routes.student

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-white dark:bg-gray-900">
          <nav className="flex flex-col gap-2">
            {currentRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition duration-300",
                  pathname === route.href
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
                onClick={() => setIsOpen(false)}
              >
                <route.icon className="h-5 w-5" />
                {route.title}
              </Link>
            ))}
            <Button
              variant="destructive"
              className="mt-4 flex items-center gap-2 w-full text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col h-screen w-64 bg-white dark:bg-gray-900 shadow-md">
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-gray-800 dark:text-white">
              Menu
            </h2>
            <div className="space-y-1">
              {currentRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition duration-300",
                    pathname === route.href
                      ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.title}
                </Link>
              ))}
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </ScrollArea>
      </nav>
    </>
  )
}
