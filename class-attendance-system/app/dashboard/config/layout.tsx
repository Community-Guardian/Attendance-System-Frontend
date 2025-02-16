import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Student dashboard for the Class Attendance System.",
}

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex flex-col h-screen lg:flex-row">
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
  )
}
