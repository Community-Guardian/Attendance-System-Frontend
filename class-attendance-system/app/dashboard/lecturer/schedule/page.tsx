import type { Metadata } from "next"
import { Calendar } from "@/components/ui/calendar"

export const metadata: Metadata = {
  title: "Lecturer Schedule",
  description: "View your teaching schedule.",
}

export default function LecturerSchedulePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Teaching Schedule</h1>
      <Calendar />
      {/* In a real application, you would fetch and display the lecturer's schedule here */}
    </div>
  )
}

