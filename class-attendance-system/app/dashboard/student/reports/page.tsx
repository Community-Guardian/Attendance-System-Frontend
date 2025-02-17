import type { Metadata } from "next"
import { Suspense } from "react"
import { ReportsDashboard } from "../components/reports-dashboard"
import { LoadingReports } from "../components/loading-reports"

export const metadata: Metadata = {
  title: "Student Reports & Analytics",
  description: "View detailed attendance reports and analytics",
}

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Suspense fallback={<LoadingReports />}>
        <ReportsDashboard />
      </Suspense>
    </div>
  )
}

