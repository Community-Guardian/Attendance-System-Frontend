"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/AuthContext"
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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role: "student" | "lecturer" | "hod" | "dp_academics" | "config"
}

export function Sidebar({ className, role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)

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
    config: [
      { href: "/dashboard/config", icon: Home, title: "Dashboard" },
      { href: "/dashboard/config/users", icon: UserCog, title: "User Management" },
      { href: "/dashboard/config/courses", icon: BookOpen, title: "Courses" },
      { href: "/dashboard/config/departments", icon: School, title: "Departments" },
      { href: "/dashboard/config/timetables", icon: Calendar, title: "Timetables" },
      { href: "/dashboard/config/geolocation", icon: Map, title: "Geolocation" },
      { href: "/dashboard/config/system", icon: Settings, title: "System Config" },
      { href: "/dashboard/config/logs", icon: BarChart, title: "System Logs" },
    ],
  }

  const currentRoutes = routes[role] || routes.student // Fallback to student routes if role is undefined

  // Handle logout action
  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login") // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <nav className="flex flex-col space-y-2">
            {currentRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                  pathname === route.href ? "bg-accent" : "transparent",
                )}
                onClick={() => setIsOpen(false)}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.title}
              </Link>
            ))}
            <Button
              variant="destructive"
              className="mt-4 flex items-center gap-2 px-3 py-2 text-sm font-medium"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
      <nav className={cn("hidden lg:flex lg:flex-col lg:w-64 lg:inset-y-0 lg:z-50", className)}>
        <ScrollArea className="flex-grow">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menu</h2>
              <div className="space-y-1">
                {currentRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                      pathname === route.href ? "bg-accent" : "transparent",
                    )}
                  >
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.title}
                  </Link>
                ))}
                <Button
                  variant="destructive"
                  className="mt-4 flex w-full items-center gap-2 px-3 py-2 text-sm font-medium"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </nav>
    </>
  )
}
