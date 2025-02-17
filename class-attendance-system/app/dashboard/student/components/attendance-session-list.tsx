"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAttendance } from "@/context/AttendanceContext"
import { formatDateTime } from "@/utils/date"
import { MapPin, Clock } from "lucide-react"

interface AttendanceSessionListProps {
  type: "active" | "upcoming" | "past"
  onSignClick?: (sessionId: string) => void
}

export function AttendanceSessionList({ type, onSignClick }: AttendanceSessionListProps) {
  const { attendanceSessions } = useAttendance()
  const now = new Date()

  const filteredSessions = attendanceSessions.filter((session) => {
    const startTime = new Date(session.start_time)
    const endTime = new Date(session.end_time)

    switch (type) {
      case "active":
        return startTime <= now && endTime >= now
      case "upcoming":
        return startTime > now
      case "past":
        return endTime < now
      default:
        return true
    }
  })

  if (filteredSessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">No {type} sessions found</CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredSessions.map((session) => (
        <Card key={session.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{session.course.name}</span>
              <span className="text-sm font-normal text-muted-foreground">{session.course.code}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>{formatDateTime(session.start_time)}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{session.geolocation_zone?.name || "No location set"}</span>
              </div>
            </div>
            {type === "active" && onSignClick && (
              <Button className="w-full" onClick={() => onSignClick(session.id)}>
                Sign Attendance
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

