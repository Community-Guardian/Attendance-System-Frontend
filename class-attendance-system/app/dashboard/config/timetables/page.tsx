import type { Metadata } from "next"
import { TimetableManagement } from "@/components/timetable-management"

export const metadata: Metadata = {
  title: "Timetable Management",
  description: "Manage timetables in the Class Attendance System.",
}

export default function TimetableManagementPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Timetable Management</h2>
      <TimetableManagement />
    </div>
  )
}

