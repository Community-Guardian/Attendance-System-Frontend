"use client";
import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export interface AttendanceSession {
  id: string
  course: string
  date: string
}

export interface User {
  id: string
  name: string
}

export interface AttendanceRecord {
  id: string
  session: Partial<AttendanceSession>
  student: Partial<User>
  timestamp: string
  latitude: number
  longitude: number
  signed_by_lecturer: boolean
}

const attendanceData: AttendanceRecord[] = [
  {
    id: "1",
    session: { course: "Mathematics 101", date: "2023-06-01" },
    student: { name: "John Doe" },
    timestamp: "2023-06-01T08:00:00Z",
    latitude: -1.2921,
    longitude: 36.8219,
    signed_by_lecturer: true,
  },
  {
    id: "2",
    session: { course: "Physics 202", date: "2023-06-02" },
    student: { name: "Jane Smith" },
    timestamp: "2023-06-02T10:15:00Z",
    latitude: -1.3000,
    longitude: 36.8000,
    signed_by_lecturer: false,
  },
  {
    id: "3",
    session: { course: "Chemistry 301", date: "2023-06-03" },
    student: { name: "Alice Johnson" },
    timestamp: "2023-06-03T11:30:00Z",
    latitude: -1.3100,
    longitude: 36.8100,
    signed_by_lecturer: false,
  },
]

export function AttendanceList() {
  const [filter, setFilter] = useState<string>("all")
  const [records, setRecords] = useState<AttendanceRecord[]>(attendanceData)

  // Filter records based on selection
  const filteredRecords = records.filter((record) => {
    if (filter === "signed") return record.signed_by_lecturer
    if (filter === "not_signed") return !record.signed_by_lecturer
    return true
  })

  // Handle lecturer signing an attendance record
  const handleSignAttendance = (id: string) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id ? { ...record, signed_by_lecturer: !record.signed_by_lecturer } : record
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Attendance Records</h2>
        <Select onValueChange={setFilter} value={filter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Records</SelectItem>
            <SelectItem value="signed">Signed</SelectItem>
            <SelectItem value="not_signed">Not Signed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableCaption>List of attendance records with signing options.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Signed by Lecturer</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.session.course}</TableCell>
              <TableCell>{record.session.date}</TableCell>
              <TableCell>{record.student.name}</TableCell>
              <TableCell>
                <Checkbox
                  checked={record.signed_by_lecturer}
                  onCheckedChange={() => handleSignAttendance(record.id)}
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
    </div>
  )
}
