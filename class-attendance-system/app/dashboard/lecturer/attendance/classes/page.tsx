"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { AttendanceSession } from "@/types/attendance"
import { useApi } from "@/hooks/customApi"
import { ATTENDANCE_SESSION_URL } from "@/handler/customApiConfig"
import { DjangoPaginatedResponse } from "@/types"
import { format } from "date-fns"
import { useSearchParams,useRouter } from "next/navigation"
export default function AttendanceSessionsPage() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get("course_id")
  const { useFetchData } = useApi<DjangoPaginatedResponse<AttendanceSession>>(ATTENDANCE_SESSION_URL)
  const {  useUpdateItem } = useApi<AttendanceSession>(ATTENDANCE_SESSION_URL)
  const { data:AttendanceSession, isLoading, isFetched, error } = useFetchData(1, { course_id: courseId || "" })
  const { toast } = useToast()
  const router  = useRouter()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Lecture Sessions</h2>
      </div>
      {isLoading && !isFetched ? (
        <p>Loading Sessions...</p>
      ) : error ? (
        <p className="text-red-500">Error loading lecture Sessions.</p>
      ) : AttendanceSession && AttendanceSession?.results.length > 0 ? (

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Locaton</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {AttendanceSession?.results.map((Session:AttendanceSession) => (
              <TableRow key={Session.id}>
                <TableCell>{Session.course.code}</TableCell>
                <TableCell>{format(new Date(Session.start_time), "yyyy-MM-dd HH:mm")}</TableCell>
                <TableCell>
                 {Session.geolocation_zone.name}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/lecturer/attendance/records/?session_id=${Session.id}`)}
                  >
                    View Records
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-500 text-center">No attendance session reports found for this course.</p>
      )}
    </div>
  )
}
