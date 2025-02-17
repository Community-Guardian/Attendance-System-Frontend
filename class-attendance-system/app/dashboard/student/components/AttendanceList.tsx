"use client"

import { useEffect, useState } from "react"
import { useAttendance } from "@/context/AttendanceContext"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "sonner"
import { formatDateTime } from "@/utils/date"
import { api } from "@/utils/api"
import { ATTENDANCE_RECORD_URL } from "@/handler/apiConfig"
export function AttendanceList() {
  const { 
    attendanceSessions, 
    fetchAttendanceSessions, 
    currentPage, 
    totalPages, 
    nextPage, 
    prevPage, 
    goToPage 
  } = useAttendance()

  const [loadingSession, setLoadingSession] = useState<string | null>(null)

  useEffect(() => {
    fetchAttendanceSessions()
  }, [])

  // Function to sign attendance
  const signAttendance = async (sessionId: string) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.")
      return
    }

    setLoadingSession(sessionId)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          const response = await api.post(`${ATTENDANCE_RECORD_URL}sign_attendance/`, 
           { session_id: sessionId, latitude, longitude }
          )

          const data = await response.data()

          if (!response.status) throw new Error(data.error || "Failed to sign attendance")

          toast.success("Attendance signed successfully!")
          fetchAttendanceSessions() // Refresh the sessions list
        } catch (error: any) {
          toast.error(error.message)
        } finally {
          setLoadingSession(null)
        }
      },
      (error) => {
        toast.error("Failed to get your location. Please enable GPS.")
        setLoadingSession(null)
      }
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-center md:text-left">Attendance Sessions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendanceSessions.length > 0 ? (
          attendanceSessions.map((session) => {
            const isActive = new Date(session.end_time) > new Date()

            return (
              <Card key={session.id} className="shadow-lg border border-gray-200 rounded-lg">
                <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
                  <CardTitle className="text-lg font-semibold">
                    {session.course.name || "Unknown Course"} ({session.course.code || "N/A"})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <p className="text-sm text-gray-600"><strong>Lecturer:</strong> {session.lecturer?.username || "Unknown"}</p>
                  <p className="text-sm text-gray-600"><strong>Start:</strong> {formatDateTime(session.start_time)}</p>
                  <p className="text-sm text-gray-600"><strong>End:</strong> {formatDateTime(session.end_time)}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Location:</strong> {session.geolocation_zone?.name || "Not Set"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Make-up Class:</strong> {session.is_makeup_class ? "Yes" : "No"}
                  </p>
                  <p className={`text-sm font-medium ${isActive ? "text-green-600" : "text-red-600"}`}>
                    {isActive ? "Active" : "Expired"}
                  </p>

                  {/* Sign Attendance Button (Only if Active) */}
                  {isActive && (
                    <Button 
                      className="w-full mt-3" 
                      disabled={loadingSession === session.id}
                      onClick={() => signAttendance(session.id)}
                    >
                      {loadingSession === session.id ? "Signing..." : "Sign Attendance"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <p className="text-center text-gray-500">No attendance sessions available.</p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          nextPage={nextPage} 
          prevPage={prevPage} 
          goToPage={goToPage} 
        />
      )}
    </div>
  )
}
