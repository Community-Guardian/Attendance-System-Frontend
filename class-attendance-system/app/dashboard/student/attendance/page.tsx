import type { Metadata } from "next"
import { Suspense } from "react"
import { StudentDashboard } from "../components/student-dashboard"
import { LoadingDashboard } from "../components/loading-dashboard"

export const metadata: Metadata = {
  title: "Student Attendance Dashboard",
  description: "View and manage your class attendance",
}

export default function AttendancePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Suspense fallback={<LoadingDashboard />}>
        <StudentDashboard />
      </Suspense>
    </div>
  )
}

