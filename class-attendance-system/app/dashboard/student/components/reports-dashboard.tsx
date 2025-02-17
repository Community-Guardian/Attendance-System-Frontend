"use client"

import { useEffect } from "react"
import { useReports } from "@/context/ReportContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ReportList } from "./report-list"
import { AttendanceHistory } from "./attendance-history"
import { TimetableReport } from "./timetable-report"
import { Download, FileSpreadsheet, Filter, PieChart, RefreshCcw, Share2 } from 'lucide-react'
import { useUser } from "@/context/userContext"
export function ReportsDashboard() {
  const {
    attendanceReports,
    studentAttendanceHistory,
    fetchAttendanceReports,
    fetchStudentAttendanceHistory,
    fetchTimetableAdherence,
    loading,
  } = useReports()

  const { user } = useUser()

  useEffect(() => {
    fetchAttendanceReports()
    fetchStudentAttendanceHistory()
    fetchTimetableAdherence()
  }, [])

  // Calculate statistics
  const totalClasses = attendanceReports.filter((report) => report.course.students?.filter((student) => student?.id===user?.id).length).length
  const totalPresent = studentAttendanceHistory.filter((history) => history.student.id===user?.id).length
  const totalStudents = attendanceReports.reduce(
    (sum, report) => sum + report.total_students,
    0
  )
  const overallAttendance =
    totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : "0"
  const perfectCourses = attendanceReports.filter(
    (report) => report.attendance_percentage === 100
  ).length

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View and analyze your attendance data
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <PieChart className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" disabled={loading}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAttendance}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPresent}/{totalClasses}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Perfect Attendance Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{perfectCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+4.18%</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:max-w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <ReportList />
        </TabsContent>
        <TabsContent value="history">
          <AttendanceHistory />
        </TabsContent>
        <TabsContent value="timetable">
          <TimetableReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
