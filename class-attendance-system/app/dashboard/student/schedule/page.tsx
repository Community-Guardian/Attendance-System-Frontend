import type { Metadata } from "next"
import { Calendar } from "@/components/ui/calendar"

export const metadata: Metadata = {
  title: "Student Schedule",
  description: "View your class schedule.",
}

export default function StudentSchedulePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Schedule</h1>
      <Calendar />
      {/* In a real application, you would fetch and display the student's schedule here */}
    </div>
  )
}

