"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, FileText, ArrowRight, Bell } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StudentAttendanceResponse } from "@/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const upcomingClassesData = [
  { id: 1, course: "CS101", time: "10:00 AM", location: "Room 201" },
  { id: 2, course: "MATH202", time: "2:00 PM", location: "Room 305" },
  { id: 3, course: "ENG103", time: "4:00 PM", location: "Room 102" },
]

const notifications = [
  { id: 1, message: "Reminder: CS101 assignment due tomorrow", time: "1 hour ago" },
  { id: 2, message: "Your attendance for MATH202 has been recorded", time: "3 hours ago" },
  { id: 3, message: "New course material available for ENG103", time: "1 day ago" },
]

export default function StudentDashboard() {
  const [attendanceData, setAttendanceData] = useState<StudentAttendanceResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeView, setTimeView] = useState<"weekly" | "monthly">("weekly")

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

  // Mock data for attendance trends
  const trendData = [
    { date: "Week 1", attendance: 85 },
    { date: "Week 2", attendance: 90 },
    { date: "Week 3", attendance: 75 },
    { date: "Week 4", attendance: 80 },
    { date: "Week 5", attendance: 95 },
    { date: "Week 6", attendance: 85 },
  ]

  const monthlyTrendData = [
    { date: "Jan", attendance: 82 },
    { date: "Feb", attendance: 88 },
    { date: "Mar", attendance: 74 },
    { date: "Apr", attendance: 85 },
    { date: "May", attendance: 90 },
  ]

  // Mock data for upcoming classes
  const upcomingClasses = [
    {
      id: "1",
      course: "Database Systems",
      code: "CS301",
      time: "11:00 AM",
      date: "Today",
      venue: "CS Lab 1",
      minutesUntil: 45,
    },
    {
      id: "2",
      course: "Software Engineering",
      code: "CS302",
      time: "2:00 PM",
      date: "Today",
      venue: "CS Lab 2",
      minutesUntil: 210,
    },
    {
      id: "3",
      course: "Computer Networks",
      code: "CS303",
      time: "9:00 AM",
      date: "Tomorrow",
      venue: "CS Lab 3",
      minutesUntil: 1380,
    },
  ]

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
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {upcomingClassesData.map((cls) => (
                <li key={cls.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{cls.course}</p>
                    <p className="text-sm text-muted-foreground">{cls.time} - {cls.location}</p>
                  </div>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
            <Button asChild className="mt-4 w-full">
              <Link href="/dashboard/student/timetable">View Full Timetable</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li key={notification.id} className="flex items-start space-x-2">
                  <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-4 w-full">
              <Link href="/dashboard/student/notifications">View All Notifications</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="col-span-full md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
              <CardDescription>Your next scheduled classes</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="flex items-center space-x-4 rounded-md border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">
                      {cls.course} ({cls.code})
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-2">
                        {cls.time} • {cls.date}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {cls.minutesUntil > 60
                          ? `in ${Math.floor(cls.minutesUntil / 60)}h ${cls.minutesUntil % 60}m`
                          : `in ${cls.minutesUntil}m`}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{cls.venue}</div>
                </div>
              ))}
            </div>
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
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendance Trend</CardTitle>
                  <CardDescription>Your attendance pattern over time</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant={timeView === "weekly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeView("weekly")}
                  >
                    Weekly
                  </Button>
                  <Button
                    variant={timeView === "monthly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeView("monthly")}
                  >
                    Monthly
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeView === "weekly" ? trendData : monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
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
