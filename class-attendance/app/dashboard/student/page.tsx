"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, FileText } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StudentAttendanceResponse } from "@/types"

export default function StudentDashboard() {
  const [attendanceData, setAttendanceData] = useState<StudentAttendanceResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Instead of fetching from API, use dummy data
    const mockAttendanceData = {
      courses: [
        {
          course_id: "101",
          course_name: "Database Systems",
          attended_sessions: 10,
          total_sessions: 12,
          attendance_percentage: 83.3,
        },
        {
          course_id: "102",
          course_name: "Software Engineering",
          attended_sessions: 8,
          total_sessions: 10,
          attendance_percentage: 80.0,
        },
        {
          course_id: "103",
          course_name: "Computer Networks",
          attended_sessions: 9,
          total_sessions: 12,
          attendance_percentage: 75.0,
        },
        {
          course_id: "104",
          course_name: "Artificial Intelligence",
          attended_sessions: 7,
          total_sessions: 8,
          attendance_percentage: 87.5,
        },
      ],
      overall_attendance: {
        attended_sessions: 34,
        total_sessions: 42,
        attendance_percentage: 81.0,
      },
    }

    // Set the mock data with a small delay to simulate API call
    setTimeout(() => {
      setAttendanceData(mockAttendanceData)
      setIsLoading(false)
    }, 500)
  }, [])

  // Mock data for the chart
  const chartData =
    attendanceData?.courses.map((course) => ({
      name: course.course_name,
      attendance: course.attendance_percentage,
    })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your attendance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : `${attendanceData?.overall_attendance.attendance_percentage.toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? ""
                : `${attendanceData?.overall_attendance.attended_sessions} of ${attendanceData?.overall_attendance.total_sessions} sessions`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next class: Database Systems at 11:00 AM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Attendance</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Software Engineering - 10:00 AM</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance by Course</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Course</CardTitle>
              <CardDescription>Your attendance percentage for each course this semester</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Activity</CardTitle>
              <CardDescription>Your recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Database Systems</p>
                    <p className="text-sm text-muted-foreground">Attended • Today at 9:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Software Engineering</p>
                    <p className="text-sm text-muted-foreground">Attended • Yesterday at 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Computer Networks</p>
                    <p className="text-sm text-muted-foreground">Attended • Yesterday at 11:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

