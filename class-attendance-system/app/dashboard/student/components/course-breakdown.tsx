"use client"

import { useReports } from "@/context/ReportContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CourseBreakdown() {
  const { studentAttendanceHistory } = useReports()

  // Group history by course
  const courseStats = studentAttendanceHistory.reduce(
    (acc, history) => {
      const courseName = history.session.course?.name || "Unknown Course"
      if (!acc[courseName]) {
        acc[courseName] = {
          total: 0,
          signed: 0,
          name: courseName,
        }
      }
      acc[courseName].total++
      if (history.signed_by_lecturer) {
        acc[courseName].signed++
      }
      return acc
    },
    {} as Record<string, { total: number; signed: number; name: string }>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course-wise Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Total Sessions</TableHead>
              <TableHead>Verified Sessions</TableHead>
              <TableHead>Verification Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(courseStats).map((stats) => (
              <TableRow key={stats.name}>
                <TableCell className="font-medium">{stats.name}</TableCell>
                <TableCell>{stats.total}</TableCell>
                <TableCell>{stats.signed}</TableCell>
                <TableCell>{((stats.signed / stats.total) * 100).toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

