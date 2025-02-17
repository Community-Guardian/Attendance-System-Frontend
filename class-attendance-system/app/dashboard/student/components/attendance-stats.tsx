"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAttendance } from "@/context/AttendanceContext"

export function AttendanceStats() {
  const { attendanceRecords, attendanceSessions } = useAttendance()

  // Calculate statistics
  const totalSessions = attendanceSessions.length
  const attendedSessions = attendanceRecords.length
  const attendancePercentage = totalSessions ? (attendedSessions / totalSessions) * 100 : 0
  const missedSessions = totalSessions - attendedSessions

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSessions}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attended</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendedSessions}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Missed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{missedSessions}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendancePercentage.toFixed(1)}%</div>
        </CardContent>
      </Card>
    </div>
  )
}

