"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BookOpen, MapPin, Settings, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConfigDashboard() {
  // Dummy data for the dashboard
  const configStats = {
    totalUsers: 3650,
    totalCourses: 120,
    totalDepartments: 8,
    totalGeozones: 15,
    recentActivities: [
      {
        id: 1,
        action: "User Created",
        details: "New student account created",
        timestamp: "2 hours ago",
        user: "Admin",
      },
      {
        id: 2,
        action: "Course Added",
        details: "New course CS401 added to Computer Science",
        timestamp: "3 hours ago",
        user: "Admin",
      },
      {
        id: 3,
        action: "Geozone Updated",
        details: "Engineering Block geozone radius updated",
        timestamp: "5 hours ago",
        user: "Admin",
      },
      {
        id: 4,
        action: "Department Added",
        details: "New department of Data Science created",
        timestamp: "1 day ago",
        user: "Admin",
      },
      {
        id: 5,
        action: "Timetable Generated",
        details: "Semester 2 timetable generated",
        timestamp: "2 days ago",
        user: "Admin",
      },
    ],
    userDistribution: [
      { name: "Students", count: 3200 },
      { name: "Lecturers", count: 320 },
      { name: "HODs", count: 8 },
      { name: "Deans", count: 2 },
      { name: "Admins", count: 5 },
      { name: "Config Users", count: 15 },
    ],
    systemHealth: {
      databaseStatus: "Healthy",
      apiStatus: "Operational",
      storageUsed: "42%",
      lastBackup: "12 hours ago",
      activeUsers: 245,
    },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration Dashboard</h1>
        <p className="text-muted-foreground">Manage system settings, users, courses, and geolocation zones</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Across all user roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configStats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Across {configStats.totalDepartments} departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configStats.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">Academic departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geolocation Zones</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configStats.totalGeozones}</div>
            <p className="text-xs text-muted-foreground">Active attendance zones</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Breakdown of users by role</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={configStats.userDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
              <CardDescription>Latest configuration changes and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {configStats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{activity.timestamp}</p>
                      <p>By: {activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current status of system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Database Status</div>
                    <div className="mt-1 text-sm">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {configStats.systemHealth.databaseStatus}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="font-medium">API Status</div>
                    <div className="mt-1 text-sm">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {configStats.systemHealth.apiStatus}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Storage Used</div>
                    <div className="mt-1 text-sm">{configStats.systemHealth.storageUsed}</div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Last Backup</div>
                    <div className="mt-1 text-sm">{configStats.systemHealth.lastBackup}</div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="font-medium">Active Users</div>
                    <div className="mt-1 text-sm">{configStats.systemHealth.activeUsers} users online</div>
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

