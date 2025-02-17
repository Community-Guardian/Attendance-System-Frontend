import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Student Reports",
  description: "View your attendance reports.",
}
export default function StudentAttendanceLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex flex-col h-screen lg:flex-row">
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
  )
}
