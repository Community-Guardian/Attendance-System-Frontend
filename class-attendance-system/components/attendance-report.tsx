"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const dummyData = {
  student: [
    { course: "MATH101", attendance: 90 },
    { course: "PHYS202", attendance: 85 },
    { course: "CHEM301", attendance: 95 },
  ],
  lecturer: [
    { course: "MATH101", averageAttendance: 88 },
    { course: "PHYS202", averageAttendance: 92 },
  ],
  hod: [
    { course: "MATH101", averageAttendance: 88 },
    { course: "PHYS202", averageAttendance: 92 },
    { course: "CHEM301", averageAttendance: 90 },
    { course: "BIO401", averageAttendance: 85 },
  ],
  dp_academics: [
    { department: "Mathematics", averageAttendance: 89 },
    { department: "Physics", averageAttendance: 91 },
    { department: "Chemistry", averageAttendance: 87 },
    { department: "Biology", averageAttendance: 88 },
  ],
}

export function AttendanceReport({ role }: { role: "student" | "lecturer" | "hod" | "dp_academics" }) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const data = dummyData[role]
  const filteredData = selectedCourse ? data.filter((item) => "course" in item && item.course === selectedCourse) : data

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>
            {role === "student" && "Your attendance across all courses"}
            {role === "lecturer" && "Average attendance for your courses"}
            {role === "hod" && "Department-wide attendance"}
            {role === "dp_academics" && "Institution-wide attendance"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {role !== "dp_academics"
              ? `${data.reduce((acc, curr) => acc + (("attendance" in curr ? curr.attendance : curr.averageAttendance) || 0), 0) / data.length}%`
              : "Institution-wide data"}
          </div>
        </CardContent>
      </Card>

      {role !== "dp_academics" && (
        <Select onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            {data.map((item) => (
              <SelectItem
                key={"course" in item ? item.course : item.department}
                value={"course" in item ? item.course : item.department}
              >
                {"course" in item ? item.course : item.department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Attendance Report</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{role === "dp_academics" ? "Department" : "Course"}</TableHead>
              <TableHead>Attendance (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{"course" in item ? item.course : item.department}</TableCell>
                <TableCell>{"attendance" in item ? item.attendance : item.averageAttendance}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

