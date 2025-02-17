import type { Metadata } from "next"
import { Suspense } from "react"
import { ScheduleDashboard } from "../components/schedule-dashboard"
import { LoadingSchedule } from "../components/loading-schedule"

export const metadata: Metadata = {
  title: "Class Schedule",
  description: "View your class schedule and active sessions",
}

export default function SchedulePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Suspense fallback={<LoadingSchedule />}>
        <ScheduleDashboard />
      </Suspense>
    </div>
  )
}

