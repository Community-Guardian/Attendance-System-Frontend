"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudentPerformancePage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Dummy data
  const courses = [
    { id: "101", name: "Database Systems", code: "CS301" },
    { id: "102", name: "Software Engineering", code: "CS302" },
    { id: "103", name: "Computer Networks", code: "CS303" },
  ]

  const students = [
    {
      id: "1",
      name: "Alice Johnson",
      studentId: "CS/001/19",
      attendanceRate: 95,
      performance: "Excellent",
      trend: "Improving",
    },
    {
      id: "2",
      name: "Bob Smith",
      studentId: "CS/002/19",
      attendanceRate: 88,
      performance: "Good",
      trend: "Stable",
    },
    {
      id: "3",
      name: "Charlie Brown",
      studentId: "CS/003/19",
      attendanceRate: 65,
      performance: "Poor",
      trend: "Declining",
    },
    {
      id: "4",
      name: "Diana Prince",
      studentId: "CS/004/19",
      attendanceRate: 92,
      performance: "Excellent",
      trend: "Stable",
    },
    {
      id: "5",
      name: "Edward Stark",
      studentId: "CS/005/19",
      attendanceRate: 72,
      performance: "Average",
      trend: "Improving",
    },
  ]

  const performanceDistribution = [
    { name: "Excellent", value: 12, color: "#4ade80" },
    { name: "Good", value: 18, color: "#22d3ee" },
    { name: "Average", value: 8, color: "#facc15" },
    { name: "Poor", value: 5, color: "#fb923c" },
    { name: "Very Poor", value: 2, color: "#f87171" },
  ]

  const attendanceTrend = [
    { name: "Week 1", attendance: 92 },
    { name: "Week 2", attendance: 88 },
    { name: "Week 3", attendance: 90 },
    { name: "Week 4", attendance: 85 },
    { name: "Week 5", attendance: 89 },
    { name: "Week 6", attendance: 91 },
  ]

  const correlationData = [
    { attendance: 95, performance: 92 },
    { attendance: 85, performance: 78 },
    { attendance: 75, performance: 65 },
    { attendance: 90, performance: 85 },
    { attendance: 65, performance: 60 },
    { attendance: 80, performance: 75 },
    { attendance: 70, performance: 68 },
    { attendance: 60, performance: 55 },
    { attendance: 100, performance: 95 },
    { attendance: 55, performance: 50 },
  ]

  // Filter students based on selected course and search query
  const filteredStudents = students.filter((student) => {
    let matchesSearch = true

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query) ||
        student.performance.toLowerCase().includes(query)
    }

    return matchesSearch
  })

  const exportReport = () => {
    // In a real app, this would generate and download a CSV or PDF
    alert("Exporting student performance report...")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Performance</h1>
        <p className="text-muted-foreground">Analyze student performance and its correlation with attendance</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82.4%</div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
                <div className="mt-4 h-[80px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceTrend}>
                      <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Good</div>
                <p className="text-xs text-muted-foreground">Average performance</p>
                <div className="mt-4 h-[80px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        dataKey="value"
                      >
                        {performanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Attendance-Performance Correlation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.87</div>
                <p className="text-xs text-muted-foreground">Strong positive correlation</p>
                <div className="mt-4 h-[80px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={correlationData}>
                      <Line type="monotone" dataKey="performance" stroke="#3b82f6" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance vs. Performance</CardTitle>
              <CardDescription>Correlation between attendance and academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { attendance: 100, performance: 95 },
                      { attendance: 90, performance: 85 },
                      { attendance: 80, performance: 75 },
                      { attendance: 70, performance: 65 },
                      { attendance: 60, performance: 55 },
                      { attendance: 50, performance: 45 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="attendance"
                      label={{ value: "Attendance (%)", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis label={{ value: "Performance Score", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="performance"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance</CardTitle>
              <CardDescription>Detailed performance metrics for each student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search students..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCourse || "all"} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} ({course.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuCheckboxItem checked>All Performance Levels</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked>Excellent</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked>Good</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked>Average</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked>Poor</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button onClick={exportReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No students found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>
                            <div
                              className={`font-medium ${
                                student.attendanceRate >= 80
                                  ? "text-green-500"
                                  : student.attendanceRate >= 70
                                    ? "text-amber-500"
                                    : "text-red-500"
                              }`}
                            >
                              {student.attendanceRate}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className={`font-medium ${
                                student.performance === "Excellent"
                                  ? "text-green-500"
                                  : student.performance === "Good"
                                    ? "text-blue-500"
                                    : student.performance === "Average"
                                      ? "text-amber-500"
                                      : "text-red-500"
                              }`}
                            >
                              {student.performance}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className={`font-medium ${
                                student.trend === "Improving"
                                  ? "text-green-500"
                                  : student.trend === "Stable"
                                    ? "text-blue-500"
                                    : "text-red-500"
                              }`}
                            >
                              {student.trend}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Student performance level distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {performanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
                <CardDescription>Weekly attendance trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[50, 100]} />
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
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Performance by Attendance Level</CardTitle>
              <CardDescription>How attendance levels correlate with performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { range: "90-100%", performance: 92 },
                      { range: "80-89%", performance: 85 },
                      { range: "70-79%", performance: 75 },
                      { range: "60-69%", performance: 65 },
                      { range: "Below 60%", performance: 55 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

