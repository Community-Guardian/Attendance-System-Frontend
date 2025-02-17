"use client"

import { useReports } from "@/context/ReportContext"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ReportList() {
  const { attendanceReports } = useReports()

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.course.name}</TableCell>
              <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
              <TableCell>{report.attendance_percentage}%</TableCell>
              <TableCell>
                <Badge
                  variant={report.attendance_percentage >= 75 ? "default" : "destructive"}
                >
                  {report.attendance_percentage >= 75 ? "Good" : "Low"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">View Details</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
