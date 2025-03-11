"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Calendar, Clock, FileText, Home, LogOut, Settings, User, Users, MapPin, BarChart, Bell, PieChart, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
}

type RoleNavItems = {
  [key: string]: NavItem[]
}

const roleNavItems: RoleNavItems = {
  student: [
    { title: "Dashboard", href: "/dashboard/student", icon: Home },
    { title: "Timetable", href: "/dashboard/student/timetable", icon: Calendar },
    { title: "Sign Attendance", href: "/dashboard/student/sign-attendance", icon: Clock },
    { title: "Attendance History", href: "/dashboard/student/attendance-history", icon: FileText },
    { title: "Attendance Trends", href: "/dashboard/student/attendance-trends", icon: BarChart },
    { title: "Notifications", href: "/dashboard/student/notifications", icon: Bell },
    { title: "Profile", href: "/dashboard/student/profile", icon: User },
  ],
  lecturer: [
    { title: "Dashboard", href: "/dashboard/lecturer", icon: Home },
    { title: "My Courses", href: "/dashboard/lecturer/courses", icon: BookOpen },
    { title: "Timetable", href: "/dashboard/lecturer/timetable", icon: Calendar },
    { title: "Manage Attendance", href: "/dashboard/lecturer/manage-attendance", icon: Clock },
    { title: "Student Performance", href: "/dashboard/lecturer/student-performance", icon: BarChart },
    { title: "Reports", href: "/dashboard/lecturer/reports", icon: FileText },
    { title: "Profile", href: "/dashboard/lecturer/profile", icon: User },
  ],
  hod: [
    { title: "Dashboard", href: "/dashboard/hod", icon: Home },
    { title: "Department Courses", href: "/dashboard/hod/courses", icon: BookOpen },
    { title: "Department Staff", href: "/dashboard/hod/staff", icon: Users },
    { title: "Attendance Reports", href: "/dashboard/hod/reports", icon: BarChart },
    { title: "Course Optimization", href: "/dashboard/hod/course-optimization", icon: Zap },
    { title: "Student Cohorts", href: "/dashboard/hod/student-cohorts", icon: PieChart },
    { title: "Settings", href: "/dashboard/hod/settings", icon: Settings },
    { title: "Profile", href: "/dashboard/hod/profile", icon: User },
  ],
  dean: [
    { title: "Dashboard", href: "/dashboard/dean", icon: Home },
    { title: "Faculty Overview", href: "/dashboard/dean/overview", icon: BarChart },
    { title: "Departments", href: "/dashboard/dean/departments", icon: Users },
    { title: "Reports", href: "/dashboard/dean/reports", icon: FileText },
    { title: "Policy Impact", href: "/dashboard/dean/policy-impact", icon: FileText },
    { title: "Benchmarking", href: "/dashboard/dean/benchmarking", icon: BarChart },
    { title: "Predictive Analysis", href: "/dashboard/dean/predictive-analysis", icon: Zap },
    { title: "Settings", href: "/dashboard/dean/settings", icon: Settings },
    { title: "Profile", href: "/dashboard/dean/profile", icon: User },
  ],
  config_user: [
    { title: "Dashboard", href: "/dashboard/config", icon: Home },
    { title: "Manage Users", href: "/dashboard/config/users", icon: Users },
    { title: "Manage Courses", href: "/dashboard/config/courses", icon: BookOpen },
    { title: "Manage Timetable", href: "/dashboard/config/timetable", icon: Calendar },
    { title: "Geolocation Zones", href: "/dashboard/config/geolocation", icon: MapPin },
    { title: "System Analytics", href: "/dashboard/config/system-analytics", icon: BarChart },
    { title: "API Monitoring", href: "/dashboard/config/api-monitoring", icon: Zap },
    { title: "Batch Operations", href: "/dashboard/config/batch-operations", icon: FileText },
    { title: "System Settings", href: "/dashboard/config/settings", icon: Settings },
    { title: "Profile", href: "/dashboard/config/profile", icon: User },
  ],
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string>("student")

  useEffect(() => {
    // Get user role from localStorage or API
    const getUserRole = () => {
      // This is a placeholder. In a real app, you'd get this from your auth state
      // For now, we'll determine the role from the URL
      if (pathname.includes("/dashboard/student")) return "student"
      if (pathname.includes("/dashboard/lecturer")) return "lecturer"
      if (pathname.includes("/dashboard/hod")) return "hod"
      if (pathname.includes("/dashboard/dean")) return "dean"
      if (pathname.includes("/dashboard/config")) return "config_user"
      if (pathname.includes("/dashboard/admin")) return "admin"
      return "student" // Default
    }

    setUserRole(getUserRole())
  }, [pathname])

  const navItems = roleNavItems[userRole] || roleNavItems.student

  const handleLogout = async () => {
    // Clear tokens and redirect to login
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    window.location.href = "/auth/login"
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            CA
          </div>
          <div className="font-semibold text-lg">Class Attendance</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
