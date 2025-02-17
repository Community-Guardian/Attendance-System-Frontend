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
import { TimetableAdherence } from "@/types/reports"
import { formatDateTime } from "@/utils/date"

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
              <TableHead>Deviation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timetableAdherence.map((adherence: TimetableAdherence) => {
              const deviation = adherence.deviation_minutes
              let badgeVariant: "default" | "secondary" | "destructive"

              if (deviation < 5) {
                badgeVariant = "default" // 🟢 On Time
              } else if (deviation >= 5 && deviation <= 15) {
                badgeVariant = "secondary" // 🟡 Slightly Late
              } else {
                badgeVariant = "destructive" // 🔴 Very Late
              }

              return (
                <TableRow key={adherence.id}>
                  <TableCell>{adherence.session.course?.name || "N/A"}</TableCell>
                  <TableCell>{adherence.session.timetable?.day_of_week || "N/A"}</TableCell>
                  <TableCell>{formatDateTime(adherence.session.timetable?.start_time as string)}</TableCell>
                  <TableCell>{formatDateTime(adherence.session.start_time as string)}</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant}>{deviation} min</Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
