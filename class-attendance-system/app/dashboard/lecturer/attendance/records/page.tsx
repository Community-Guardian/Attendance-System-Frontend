"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { AttendanceRecord } from "@/types/attendance"
import { useApi } from "@/hooks/customApi"
import { ATTENDANCE_RECORD_URL } from "@/handler/customApiConfig"
import { DjangoPaginatedResponse } from "@/types"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"

export default function AttendanceRecordsPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { useFetchData } = useApi<DjangoPaginatedResponse<AttendanceRecord>>(ATTENDANCE_RECORD_URL)
  const {  useUpdateItem } = useApi<AttendanceRecord>(ATTENDANCE_RECORD_URL)
  const { data:attendanceRecords, isLoading, isFetched, error } = useFetchData(1, { session_id: sessionId || "" })
  const { toast } = useToast()
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [courseName, setCourseName] = useState<string | null>(null)
  // Handle signing attendance
  const handleSignAttendance = async (recordId: string) => {
    try {
      await useUpdateItem.mutateAsync({ id: recordId, item: { signed_by_lecturer: true  }});
      toast({ title: "Success", description: "Attendance marked as signed.", variant: "default" })
    } catch {
      toast({ title: "Error", description: "Failed to sign attendance.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Attendance Records</h2>
      </div>
      {isLoading && !isFetched ? (
        <p>Loading attendance...</p>
      ) : error ? (
        <p className="text-red-500">Error loading attendance records.</p>
      ) : attendanceRecords && attendanceRecords?.results.length > 0 ? (

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords?.results.map((record:AttendanceRecord) => (
              <TableRow key={record.id}>
                <TableCell>{record.student?.email ?? ""}</TableCell>
                <TableCell>{format(new Date(record.timestamp), "yyyy-MM-dd")}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={record.signed_by_lecturer}
                    onCheckedChange={() => handleSignAttendance(record.id)}
                    disabled={record.signed_by_lecturer}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => handleSignAttendance(record.id)}
                    disabled={record.signed_by_lecturer}
                  >
                    {record.signed_by_lecturer ? "Signed" : "Sign"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-500 text-center">No attendance records found for this course.</p>
      )}
    </div>
  )
}
