import type { Metadata } from "next"
import { Suspense } from "react"
import { ScheduleDashboard } from "@/components/schedule/schedule-dashboard"
import { LoadingSchedule } from "@/components/schedule/loading-schedule"

export const metadata: Metadata = {
  title: "Lecturer Schedule",
  description: "View your teaching schedule.",
}

export default function LecturerSchedulePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Suspense fallback={<LoadingSchedule />}>
        <ScheduleDashboard />
      </Suspense>
    </div>
  )
}

