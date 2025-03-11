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
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar, Download, Search } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AttendanceReportsPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [searchQuery, setSearchQuery] = useState("")

  // Dummy data
  const courses = [
    { id: "101", name: "Database Systems", code: "CS301" },
    { id: "102", name: "Software Engineering", code: "CS302" },
    { id: "103", name: "Computer Networks", code: "CS303" },
  ]

  const attendanceReports = [
    {
      id: "1",
      course: { id: "101", name: "Database Systems", code: "CS301" },
      date: "May 15, 2023",
      totalStudents: 40,
      studentsPresent: 36,
      attendancePercentage: 90,
    },
    {
      id: "2",
      course: { id: "101", name: "Database Systems", code: "CS301" },
      date: "May 8, 2023",
      totalStudents: 40,
      studentsPresent: 38,
      attendancePercentage: 95,
    },
    {
      id: "3",
      course: { id: "102", name: "Software Engineering", code: "CS302" },
      date: "May 15, 2023",
      totalStudents: 45,
      studentsPresent: 38,
      attendancePercentage: 84,
    },
    {
      id: "4",
      course: { id: "102", name: "Software Engineering", code: "CS302" },
      date: "May 8, 2023",
      totalStudents: 45,
      studentsPresent: 40,
      attendancePercentage: 89,
    },
    {
      id: "5",
      course: { id: "103", name: "Computer Networks", code: "CS303" },
      date: "May 14, 2023",
      totalStudents: 35,
      studentsPresent: 28,
      attendancePercentage: 80,
    },
    {
      id: "6",
      course: { id: "103", name: "Computer Networks", code: "CS303" },
      date: "May 7, 2023",
      totalStudents: 35,
      studentsPresent: 30,
      attendancePercentage: 86,
    },
  ]

  const courseAttendanceTrend = [
    { name: "Week 1", CS301: 92, CS302: 88, CS303: 85 },
    { name: "Week 2", CS301: 90, CS302: 85, CS303: 82 },
    { name: "Week 3", CS301: 95, CS302: 90, CS303: 86 },
    { name: "Week 4", CS301: 88, CS302: 84, CS303: 80 },
    { name: "Week 5", CS301: 90, CS302: 89, CS303: 86 },
    { name: "Week 6", CS301: 93, CS302: 87, CS303: 84 },
  ]

  const studentAttendanceDistribution = [
    { name: "90-100%", value: 25, color: "#4ade80" },
    { name: "80-89%", value: 15, color: "#22d3ee" },
    { name: "70-79%", value: 8, color: "#facc15" },
    { name: "60-69%", value: 5, color: "#fb923c" },
    { name: "Below 60%", value: 2, color: "#f87171" },
  ]

  // Filter reports based on selected course and search query
  const filteredReports = attendanceReports.filter((report) => {
    let matchesCourse = true
    let matchesSearch = true

    if (selectedCourse) {
      matchesCourse = report.course.id === selectedCourse
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matchesSearch =
        report.course.name.toLowerCase().includes(query) ||
        report.course.code.toLowerCase().includes(query) ||
        report.date.toLowerCase().includes(query)
    }

    return matchesCourse && matchesSearch
  })

  const exportReport = () => {
    // In a real app, this would generate and download a CSV or PDF
    alert("Exporting report...")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Reports</h1>
        <p className="text-muted-foreground">View and analyze attendance data for your courses</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
                <div className="mt-4 h-[80px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={courses.map((course) => {
                        const reports = attendanceReports.filter((r) => r.course.id === course.id)
                        const avgAttendance =
                          reports.reduce((sum, r) => sum + r.attendancePercentage, 0) / reports.length
                        return {
                          name: course.code,
                          attendance: avgAttendance,
                        }
                      })}
                    >
                      <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">This semester</p>
                <div className="mt-4 h-[80px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={courses.map((course) => {
                        const reports = attendanceReports.filter((r) => r.course.id === course.id)
                        return {
                          name: course.code,
                          sessions: reports.length,
                        }
                      })}
                    >
                      <Bar dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Student Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">Total students</p>
                <div className="mt-4 h-[80px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={studentAttendanceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        dataKey="value"
                      >
                        {studentAttendanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>Weekly attendance percentage by course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={courseAttendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="CS301" name="Database Systems" stroke="#3b82f6" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="CS302"
                      name="Software Engineering"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="CS303" name="Computer Networks" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>Detailed attendance reports for each session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search reports..."
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
                        <SelectItem key={course.id} value={course.id || "default"}>
                          {course.name} ({course.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
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
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Students Present</TableHead>
                      <TableHead>Total Students</TableHead>
                      <TableHead>Attendance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No reports found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="font-medium">{report.course.name}</div>
                            <div className="text-sm text-muted-foreground">{report.course.code}</div>
                          </TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>{report.studentsPresent}</TableCell>
                          <TableCell>{report.totalStudents}</TableCell>
                          <TableCell>
                            <div
                              className={`font-medium ${
                                report.attendancePercentage >= 80
                                  ? "text-green-500"
                                  : report.attendancePercentage >= 70
                                    ? "text-amber-500"
                                    : "text-red-500"
                              }`}
                            >
                              {report.attendancePercentage}%
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
                <CardTitle>Attendance Distribution</CardTitle>
                <CardDescription>Student attendance percentage distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={studentAttendanceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {studentAttendanceDistribution.map((entry, index) => (
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
                <CardTitle>Course Comparison</CardTitle>
                <CardDescription>Average attendance by course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={courses.map((course) => {
                        const reports = attendanceReports.filter((r) => r.course.id === course.id)
                        const avgAttendance =
                          reports.reduce((sum, r) => sum + r.attendancePercentage, 0) / reports.length
                        return {
                          name: course.code,
                          attendance: avgAttendance,
                        }
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="attendance" fill="#3b82f6">
                        {courses.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b"][index % 3]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Patterns</CardTitle>
              <CardDescription>Attendance patterns by day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { day: "Monday", attendance: 88 },
                      { day: "Tuesday", attendance: 92 },
                      { day: "Wednesday", attendance: 85 },
                      { day: "Thursday", attendance: 90 },
                      { day: "Friday", attendance: 78 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="attendance" fill="#3b82f6" />
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

