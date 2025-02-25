"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { useAttendance } from "@/context/AttendanceContext"
import { AttendanceRecord } from "@/types/attendance"

export default function CourseAttendancePage() {
  const { courseId } = useParams()
  const { fetchAttendanceRecords, updateAttendanceRecord, attendanceRecords, loading, error } = useAttendance()
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [courseName, setCourseName] = useState<string | null>(null)

  useEffect(() => {
    if (courseId) {
      const singleCourseId = Array.isArray(courseId) ? courseId[0] : courseId

      const fetchData = async () => {
        try {
          await fetchAttendanceRecords({ course_id: singleCourseId })
        } catch {
          toast({ title: "Error", description: "Failed to fetch attendance.", variant: "destructive" })
        }
      }

      fetchData()
    }
  }, [courseId])

  useEffect(() => {
    if (attendanceRecords.length > 0) {
      const singleCourseId = Array.isArray(courseId) ? courseId[0] : courseId

      const filtered = attendanceRecords.filter(
        (record) => record.session.course?.id === singleCourseId
      )

      setFilteredRecords(filtered)

      // Set Course Name from First Record
      if (filtered.length > 0 && filtered[0].session.course?.name) {
        setCourseName(filtered[0].session.course.name)
      }
    }
  }, [attendanceRecords, courseId])

  // Handle signing attendance
  const handleSignAttendance = async (recordId: string) => {
    try {
      await updateAttendanceRecord(recordId, { signed_by_lecturer: true })
      toast({ title: "Success", description: "Attendance marked as signed.", variant: "success" })
    } catch {
      toast({ title: "Error", description: "Failed to sign attendance.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">
        Attendance for {courseName ? `Course: ${courseName}` : `Course ID: ${courseId}`}
      </h1>

      {loading ? (
        <p>Loading attendance...</p>
      ) : error ? (
        <p className="text-red-500">Error loading attendance records.</p>
      ) : filteredRecords.length > 0 ? (
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
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.student?.name ?? ""}</TableCell>
                <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
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
