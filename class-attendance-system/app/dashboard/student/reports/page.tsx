"use client"

import { useEffect } from "react"
import { useReports } from "@/context/ReportContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudentReportsPage() {
  const { 
    attendanceReports, 
    fetchAttendanceReports, 
    loading, 
    error 
  } = useReports()

  useEffect(() => {
    fetchAttendanceReports()
  }, [])

  if (loading) return <p className="text-center">Loading reports...</p>
  if (error) return <p className="text-center text-red-500">Error loading reports: {error}</p>

  // Aggregate Data
  const totalClasses = attendanceReports.length
  const totalStudents = attendanceReports.reduce((sum, report) => sum + report.total_students, 0)
  const totalPresent = attendanceReports.reduce((sum, report) => sum + report.students_present.length, 0)
  const overallAttendance = totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : "0"

  // Identify Perfect Attendance Courses
  const perfectCourses = attendanceReports.filter(report => report.attendance_percentage === 100).length

  // Find Lowest Attendance Course
  const lowestAttendanceCourse = attendanceReports.reduce((lowest, report) =>
    report.attendance_percentage < lowest.attendance_percentage ? report : lowest, attendanceReports[0]
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Reports</h1>
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
            <div className="text-2xl font-bold">{totalPresent}/{totalClasses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfect Attendance Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{perfectCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Attendance Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lowestAttendanceCourse ? `${lowestAttendanceCourse.attendance_percentage}%` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {lowestAttendanceCourse ? lowestAttendanceCourse.course.name : "No Data"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
