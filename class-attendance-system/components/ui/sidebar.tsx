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
  Loader2,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user,  loading } = useUser()
  const {logout} = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace("/login") // Redirect if no user
    }
  }, [user, loading, router])


  const role = user?.role as keyof typeof routes

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
    // hod: [
    //   { href: "/dashboard/hod", icon: Home, title: "Dashboard" },
    //   { href: "/dashboard/hod/courses", icon: BookOpen, title: "Courses" },
    //   { href: "/dashboard/hod/lecturers", icon: Users, title: "Lecturers" },
    //   { href: "/dashboard/hod/students", icon: User, title: "Students" },
    //   { href: "/dashboard/hod/attendance", icon: Activity, title: "Attendance" },
    //   { href: "/dashboard/hod/timetable", icon: Calendar, title: "Timetable" },
    //   { href: "/dashboard/hod/reports", icon: FileText, title: "Reports" },
    //   { href: "/dashboard/hod/settings", icon: Settings, title: "Settings" },
    // ],
    // dp_academics: [
    //   { href: "/dashboard/dp-academics", icon: Home, title: "Dashboard" },
    //   { href: "/dashboard/dp-academics/departments", icon: School, title: "Departments" },
    //   { href: "/dashboard/dp-academics/courses", icon: BookOpen, title: "Courses" },
    //   { href: "/dashboard/dp-academics/attendance", icon: Activity, title: "Attendance" },
    //   { href: "/dashboard/dp-academics/timetable", icon: Calendar, title: "Timetable" },
    //   { href: "/dashboard/dp-academics/reports", icon: FileText, title: "Reports" },
    //   { href: "/dashboard/dp-academics/settings", icon: Settings, title: "Settings" },
    // ],
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
    // admin: [
    //   { href: "/dashboard/admin", icon: Home, title: "Admin Dashboard" },
    //   { href: "/dashboard/admin/users", icon: Users, title: "Manage Users" },
    //   { href: "/dashboard/admin/settings", icon: Settings, title: "Settings" },
    // ],
  }

  const currentRoutes = routes[role] || routes.student
  const [loggingOut, setLoggingOut] = useState(false)

  const { toast } = useToast()
  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })
      router.replace("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden justify-end">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 h-full bg-white dark:bg-gray-900 shadow-lg p-4 flex flex-col">
          <ScrollArea className="flex-grow overflow-y-auto">
            <nav className="flex flex-col gap-2">
              {currentRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300",
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
            </nav>
          </ScrollArea>
          {/* Sign Out Button */}
          <div className="mt-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full flex items-center justify-center py-3">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                  <AlertDialogDescription>You will need to sign in again to access your account.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {loggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
            </div>
          </div>
        </ScrollArea>
        {/* Sign Out Button */}
        <div className="p-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full flex items-center justify-center py-3">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                <AlertDialogDescription>You will need to sign in again to access your account.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {loggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </nav>
    </>
  );
}
