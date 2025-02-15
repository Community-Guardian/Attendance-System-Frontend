import type { Metadata } from "next"
import { AttendanceList } from "@/components/attendance-list"
import { AttendanceSign } from "@/components/attendance-sign"

export const metadata: Metadata = {
  title: "Student Attendance",
  description: "View and sign attendance for your classes.",
}

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Attendance</h1>
        <AttendanceSign />
      </div>
      <AttendanceList />
    </div>
  )
}

