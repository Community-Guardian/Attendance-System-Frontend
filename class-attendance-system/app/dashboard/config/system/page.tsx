import type { Metadata } from "next"
import { SystemConfiguration } from "@/components/systemConfiguration"

export const metadata: Metadata = {
  title: "System Configuration",
  description: "Manage system configuration in the Class Attendance System.",
}

export default function SystemConfigPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">System Configuration</h2>
      <SystemConfiguration />
    </div>
  )
}

