import type { Metadata } from "next"
import { AttendanceList } from "@/components/attendance-list"
import { StartAttendanceSession } from "@/components/start-attendance-session"
import { ManualAttendanceSign } from "@/components/manual-attendance-sign"

export const metadata: Metadata = {
  title: "Lecturer Attendance",
  description: "Manage attendance for your classes.",
}

export default function LecturerAttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Attendance Management</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Start/Close Session</h2>
          <StartAttendanceSession />
        </div>
      </div>
      <AttendanceList />
    </div>
  )
}

