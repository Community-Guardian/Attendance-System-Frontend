"use client"
import { useState, useEffect } from "react"
import { useAttendance } from "@/context/AttendanceContext"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { AttendanceSignModal } from "./AttendanceSignModal"
import { formatDateTime } from "@/utils/date"

export function AttendanceList() {
  const { attendanceSessions, fetchAttendanceSessions, currentPage, totalPages, nextPage, prevPage, goToPage } = useAttendance()
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  useEffect(() => {
    fetchAttendanceSessions()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Your Attendance Sessions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendanceSessions.map((session) => (
          <Card key={session.id} className="shadow-md">
            <CardHeader>
              <CardTitle>{session.course}</CardTitle>
              <p className="text-sm text-gray-500">{session.lecturer}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Start: {formatDateTime(session.start_time)}</p>
              <p className="text-sm">End: {formatDateTime(session.end_time)}</p>
              <p className="text-sm text-gray-700">
                {new Date(session.end_time) > new Date() ? "Active" : "Expired"}
              </p>
              {new Date(session.end_time) > new Date() ? (
                <Button variant="default" onClick={() => setSelectedSession(session.id)}>Sign Attendance</Button>
              ) : (
                <Button variant="secondary" disabled>Session Expired</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} nextPage={nextPage} prevPage={prevPage} goToPage={goToPage} />

      {selectedSession && <AttendanceSignModal sessionId={selectedSession} isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} />}
    </div>
  )
}
