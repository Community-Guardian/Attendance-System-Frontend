"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useReports } from "@/context/ReportContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

export default function CourseReportPage() {
  const { courseId } = useParams()
  const { fetchAttendanceReports, attendanceReports, setFilters } = useReports()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (courseId) {
      setFilters({ course: courseId }) // Apply course filter

      fetchAttendanceReports()
        .then(() => {
          console.log("Fetched reports:", attendanceReports) // Debugging
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching report:", error)
          toast({ title: "Error", description: "Failed to fetch report.", variant: "destructive" })
          setIsLoading(false)
        })
    }
  }, [courseId])

  useEffect(() => {
    console.log("Updated Reports State:", attendanceReports) // Ensure state updates
  }, [attendanceReports])

  // Extract course name from the first report (if available)
  const courseName = attendanceReports.length > 0 ? attendanceReports[0].course.name : "Unknown Course"

  return (
    <div className="space-y-4">
      {/* <h1 className="text-xl font-bold">Attendance Report for Course ID: {courseId}</h1> */}
      <h1 className="text-xl font-bold">Attendance Report for Course : {courseName}</h1>

      {isLoading ? (
        <p>Loading report...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead>Present</TableHead>
              <TableHead>Attendance %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceReports?.length > 0 ? (
              attendanceReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{new Date(report.report_date).toLocaleDateString()}</TableCell>
                  <TableCell>{report.total_students}</TableCell>
                  <TableCell>{report.students_present}</TableCell>
                  <TableCell>{report.attendance_percentage}%</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No report available for this course.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
