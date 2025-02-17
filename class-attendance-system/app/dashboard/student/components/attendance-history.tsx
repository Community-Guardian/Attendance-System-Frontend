"use client"

import { useReports } from "@/context/ReportContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function AttendanceHistory() {
  const { studentAttendanceHistory } = useReports()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentAttendanceHistory.map((history) => (
              <TableRow key={history.id}>
                <TableCell>
                  {new Date(history.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell>{history.session.course?.name}</TableCell>
                <TableCell>{history.signed_by_lecturer ?"verified":"Unverified"}</TableCell>
                <TableCell>{new Date(history.timestamp).toLocaleTimeString()}</TableCell>
                <TableCell>{history.session.geolocation_zone?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
