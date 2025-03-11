"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BookOpen, Clock, Users, AlertTriangle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LecturerDashboard() {
  // Dummy data for the dashboard
  const attendanceStats = {
    totalStudents: 120,
    totalCourses: 3,
    activeSessions: 1,
    lowAttendanceCourses: 1,
    courseStats: [
      {
        name: "Database Systems",
        code: "CS301",
        attendance: 85,
        students: 40,
      },
      {
        name: "Software Engineering",
        code: "CS302",
        attendance: 72,
        students: 45,
      },
      {
        name: "Computer Networks",
        code: "CS303",
        attendance: 65,
        students: 35,
      },
    ],
    recentSessions: [
      {
        id: "1",
        course: "Database Systems",
        code: "CS301",
        date: "Today",
        time: "09:00 AM",
        attendance: "36/40",
        percentage: 90,
      },
      {
        id: "2",
        course: "Software Engineering",
        code: "CS302",
        date: "Yesterday",
        time: "02:00 PM",
        attendance: "38/45",
        percentage: 84,
      },
      {
        id: "3",
        course: "Computer Networks",
        code: "CS303",
        date: "2 days ago",
        time: "11:00 AM",
        attendance: "28/35",
        percentage: 80,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lecturer Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your courses and attendance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across {attendanceStats.totalCourses} courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">Database Systems - Ongoing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Attendance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.lowAttendanceCourses}</div>
            <p className="text-xs text-muted-foreground">Course below 70% attendance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Course Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Course</CardTitle>
              <CardDescription>Average attendance percentage for each course</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={attendanceStats.courseStats}>
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
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your most recent attendance sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceStats.recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">
                        {session.course} ({session.code})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.date} at {session.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{session.attendance}</p>
                      <p
                        className={`text-sm ${
                          session.percentage >= 80
                            ? "text-green-500"
                            : session.percentage >= 70
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {session.percentage}% attendance
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

