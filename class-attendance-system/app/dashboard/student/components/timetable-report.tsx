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
import { Badge } from "@/components/ui/badge"

export function TimetableReport() {
  const { timetableAdherence } = useReports()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timetable Adherence</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Scheduled Time</TableHead>
              <TableHead>Actual Time</TableHead>
              <TableHead>Adherence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timetableAdherence.map((adherence) => (
              <TableRow key={adherence.id}>
                <TableCell>{adherence.session.course?.name}</TableCell>
                <TableCell>{adherence.session.timetable?.day_of_week}</TableCell>
                <TableCell>{adherence.session.timetable?.start_time}</TableCell>
                <TableCell>{adherence.started_on_time}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      adherence.deviation_minutes >= 90
                        ? "default"
                        : adherence.deviation_minutes >= 75
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {adherence.deviation_minutes}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
