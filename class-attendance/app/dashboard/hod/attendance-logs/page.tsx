"use client"

import { useState } from "react"
import { CalendarIcon, Check, Download, FileText, Search, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function AttendanceLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()

  // Dummy data
  const students = [
    { id: "1", name: "Alice Johnson", studentId: "CS/001/20" },
    { id: "2", name: "Bob Smith", studentId: "CS/002/20" },
    { id: "3", name: "Charlie Brown", studentId: "CS/003/20" },
    { id: "4", name: "Diana Prince", studentId: "IT/001/20" },
    { id: "5", name: "Edward Stark", studentId: "IT/002/20" },
  ]

  const courses = [
    { id: "101", name: "Database Systems", code: "CS301" },
    { id: "102", name: "Software Engineering", code: "CS302" },
    { id: "103", name: "Computer Networks", code: "CS303" },
    { id: "104", name: "Artificial Intelligence", code: "CS304" },
    { id: "105", name: "Web Development", code: "CS305" },
  ]

  const attendanceLogs = [
    {
      id: "1",
      studentId: "CS/001/20",
      studentName: "Alice Johnson",
      course: "Database Systems",
      courseCode: "CS301",
      date: "2023-05-15",
      time: "09:15:00",
      status: "present",
      verifiedByLecturer: true,
    },
    {
      id: "2",
      studentId: "CS/001/20",
      studentName: "Alice Johnson",
      course: "Software Engineering",
      courseCode: "CS302",
      date: "2023-05-15",
      time: "14:10:00",
      status: "present",
      verifiedByLecturer: true,
    },
    {
      id: "3",
      studentId: "CS/001/20",
      studentName: "Alice Johnson",
      course: "Computer Networks",
      courseCode: "CS303",
      date: "2023-05-16",
      time: "11:05:00",
      status: "present",
      verifiedByLecturer: false,
    },
    {
      id: "4",
      studentId: "CS/001/20",
      studentName: "Alice Johnson",
      course: "Artificial Intelligence",
      courseCode: "CS304",
      date: "2023-05-17",
      time: "09:08:00",
      status: "absent",
      verifiedByLecturer: true,
    },
    {
      id: "5",
      studentId: "CS/002/20",
      studentName: "Bob Smith",
      course: "Database Systems",
      courseCode: "CS301",
      date: "2023-05-15",
      time: "09:12:00",
      status: "present",
      verifiedByLecturer: true,
    },
    {
      id: "6",
      studentId: "CS/002/20",
      studentName: "Bob Smith",
      course: "Software Engineering",
      courseCode: "CS302",
      date: "2023-05-15",
      time: "14:05:00",
      status: "present",
      verifiedByLecturer: true,
    },
    {
      id: "7",
      studentId: "CS/002/20",
      studentName: "Bob Smith",
      course: "Computer Networks",
      courseCode: "CS303",
      date: "2023-05-16",
      time: "11:15:00",
      status: "absent",
      verifiedByLecturer: true,
    },
    {
      id: "8",
      studentId: "CS/003/20",
      studentName: "Charlie Brown",
      course: "Database Systems",
      courseCode: "CS301",
      date: "2023-05-15",
      time: "09:20:00",
      status: "late",
      verifiedByLecturer: true,
    },
    {
      id: "9",
      studentId: "CS/003/20",
      studentName: "Charlie Brown",
      course: "Software Engineering",
      courseCode: "CS302",
      date: "2023-05-15",
      time: "14:30:00",
      status: "late",
      verifiedByLecturer: true,
    },
    {
      id: "10",
      studentId: "IT/001/20",
      studentName: "Diana Prince",
      course: "Web Development",
      courseCode: "CS305",
      date: "2023-05-17",
      time: "14:10:00",
      status: "present",
      verifiedByLecturer: true,
    },
  ]

  // Get summary statistics
  const getAttendanceStats = (studentId: string) => {
    const studentLogs = attendanceLogs.filter((log) => log.studentId === studentId)
    const totalSessions = studentLogs.length
    const presentSessions = studentLogs.filter((log) => log.status === "present").length
    const lateSessions = studentLogs.filter((log) => log.status === "late").length
    const absentSessions = studentLogs.filter((log) => log.status === "absent").length

    const attendancePercentage = totalSessions > 0 ? ((presentSessions + lateSessions) / totalSessions) * 100 : 0

    return {
      totalSessions,
      presentSessions,
      lateSessions,
      absentSessions,
      attendancePercentage: attendancePercentage.toFixed(1),
    }
  }

  // Filter logs based on selected student and filters
  const filteredLogs = attendanceLogs.filter((log) => {
    let matchesQuery = true
    let matchesCourse = true
    let matchesStudent = true
    let matchesDate = true

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matchesQuery =
        log.studentName.toLowerCase().includes(query) ||
        log.studentId.toLowerCase().includes(query) ||
        log.course.toLowerCase().includes(query) ||
        log.courseCode.toLowerCase().includes(query)
    }

    if (selectedCourse) {
      matchesCourse = log.courseCode === selectedCourse
    }

    if (selectedStudent) {
      matchesStudent = log.studentId === selectedStudent
    }

    if (date) {
      matchesDate = log.date === format(date, "yyyy-MM-dd")
    }

    return matchesQuery && matchesCourse && matchesStudent && matchesDate
  })

  const handleExportCSV = () => {
    toast({
      title: "Exporting CSV",
      description: "Attendance logs are being exported to CSV.",
    })
  }

  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: "Attendance logs are being exported to PDF.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Logs</h1>
          <p className="text-muted-foreground">View and analyze student attendance records</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Attendance Logs</TabsTrigger>
          <TabsTrigger value="summary">Student Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>View and filter student attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-8 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedStudent || ""} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All students" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All students">All students</SelectItem>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.studentId}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedCourse || ""} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All courses">All courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.code}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[180px]">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                  {(searchQuery || selectedStudent || selectedCourse || date) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedStudent(null)
                        setSelectedCourse(null)
                        setDate(undefined)
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear filters</span>
                    </Button>
                  )}
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified by Lecturer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No attendance records found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{format(new Date(log.date), "PP")}</TableCell>
                          <TableCell>{format(new Date(`2000-01-01T${log.time}`), "p")}</TableCell>
                          <TableCell>
                            <div className="font-medium">{log.studentName}</div>
                            <div className="text-sm text-muted-foreground">{log.studentId}</div>
                          </TableCell>
                          <TableCell>
                            <div>{log.course}</div>
                            <div className="text-sm text-muted-foreground">{log.courseCode}</div>
                          </TableCell>
                          <TableCell>
                            {log.status === "present" ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Present
                              </span>
                            ) : log.status === "late" ? (
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                Late
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                Absent
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {log.verifiedByLecturer ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
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
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance Summary</CardTitle>
              <CardDescription>Overview of attendance by student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Total Sessions</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Late</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Attendance Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const stats = getAttendanceStats(student.studentId)
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.studentId}</div>
                          </TableCell>
                          <TableCell>{stats.totalSessions}</TableCell>
                          <TableCell>{stats.presentSessions}</TableCell>
                          <TableCell>{stats.lateSessions}</TableCell>
                          <TableCell>{stats.absentSessions}</TableCell>
                          <TableCell>
                            <div
                              className={`font-medium ${
                                Number.parseFloat(stats.attendancePercentage) >= 80
                                  ? "text-green-500"
                                  : Number.parseFloat(stats.attendancePercentage) >= 70
                                    ? "text-amber-500"
                                    : "text-red-500"
                              }`}
                            >
                              {stats.attendancePercentage}%
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

